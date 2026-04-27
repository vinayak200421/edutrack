// Starts the Express API for authentication, students, courses, and enrollments.
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("./userModel");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");
const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGO_URI;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

if (!mongoUri) {
  throw new Error("MONGO_URI is required");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");

const PORT = process.env.PORT || 5000;

// Health check route; receives no params and returns server status.
app.get("/", (req, res) => {
  res.json({ message: "server is running 8090" });
});

// Stores student profile fields linked to optional login accounts.
const studentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    image: String,
    name: String,
    email: String,
    address: String,
    grade: Number,
    class: String,
    homeMobile: String,
    motherName: String,
    fatherName: String,
    motherMobile: String,
    fatherMobile: String,
    isMotherEmployed: Boolean,
    motherEmployerName: String,
    motherJobPosition: String,
    isFatherEmployed: Boolean,
    fatherEmployerName: String,
    fatherJobPosition: String,
    hasSiblings: Boolean,
    sibling1Name: String,
    sibling2Name: String,
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("student", studentSchema);

// API: POST /api/courses expects course fields and creates an admin-only course.
app.post("/api/courses", auth, admin, async (req, res) => {
  try {
    const { name, code, credits, description, instructor, maxSeats } = req.body;

    if (!name || !code || !credits || !instructor || !maxSeats) {
      return res.status(400).json({
        success: false,
        message: "name, code, credits, instructor and maxSeats are required",
      });
    }

    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course code already exists",
      });
    }

    const course = await Course.create({
      name,
      code,
      credits,
      description,
      instructor,
      maxSeats,
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: course,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
});

// API: GET /api/courses returns all courses with computed remaining seats.
app.get("/api/courses", auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    const data = courses.map((course) => {
      const courseObject = course.toObject();

      return {
        ...courseObject,
        seatsLeft: Math.max(course.maxSeats - course.enrolledCount, 0),
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
});

// API: DELETE /api/courses/:id removes a course and related enrollment records.
app.delete("/api/courses/:id", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Enrollment.deleteMany({ courseId: id });
    await Course.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Course removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
});

// API: GET /api/courses/:id/students returns profile details for enrolled students.
app.get("/api/courses/:id/students", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const enrollments = await Enrollment.find({
      courseId: id,
      status: "enrolled",
    })
      .populate("studentId", "email role")
      .sort({ enrolledAt: -1 });

    const studentIds = enrollments.map((enrollment) => enrollment.studentId?._id).filter(Boolean);
    // Enrollment records point to users, so profiles are joined separately by userId.
    const studentProfiles = await studentModel.find({ userId: { $in: studentIds } });
    const studentProfileMap = new Map(
      studentProfiles.map((student) => [String(student.userId), student])
    );

    const data = enrollments.map((enrollment) => {
      const user = enrollment.studentId;
      const studentProfile = user ? studentProfileMap.get(String(user._id)) : null;

      return {
        _id: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        student: {
          userId: user?._id || null,
          email: user?.email || "",
          role: user?.role || "",
          name: studentProfile?.name || "",
          address: studentProfile?.address || "",
          grade: studentProfile?.grade || null,
          class: studentProfile?.class || "",
        },
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled students",
    });
  }
});

// API: POST /api/enrollments expects courseId and enrolls the signed-in student.
app.post("/api/enrollments", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can enroll in courses",
      });
    }

    const { courseId } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Valid courseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });

    if (existingEnrollment?.status === "enrolled") {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    if (course.enrolledCount >= course.maxSeats) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this course",
      });
    }

    // Reusing a dropped enrollment preserves the unique student-course record.
    if (existingEnrollment?.status === "dropped") {
      existingEnrollment.status = "enrolled";
      existingEnrollment.enrolledAt = new Date();
      await existingEnrollment.save();
    } else {
      await Enrollment.create({
        studentId: req.user.id,
        courseId,
        status: "enrolled",
      });
    }

    course.enrolledCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
});

// API: DELETE /api/enrollments/:courseId marks the signed-in student's enrollment as dropped.
app.delete("/api/enrollments/:courseId", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can drop courses",
      });
    }

    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
      status: "enrolled",
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    enrollment.status = "dropped";
    await enrollment.save();

    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledCount: -1 },
    });

    res.json({
      success: true,
      message: "Course dropped successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to drop course",
    });
  }
});

// API: GET /api/enrollments/my returns active enrollments for the signed-in student.
app.get("/api/enrollments/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their enrollments",
      });
    }

    const enrollments = await Enrollment.find({
      studentId: req.user.id,
      status: "enrolled",
    })
      .populate("courseId")
      .sort({ enrolledAt: -1 });

    const data = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      status: enrollment.status,
      course: enrollment.courseId
        ? {
            ...enrollment.courseId.toObject(),
            seatsLeft: Math.max(
              enrollment.courseId.maxSeats - enrollment.courseId.enrolledCount,
              0
            ),
          }
        : null,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your enrollments",
    });
  }
});

const storage = multer.diskStorage({
  // Keeps uploaded student images in the local uploads directory.
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Prefixes filenames to avoid collisions between similarly named uploads.
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API: POST /create expects multipart student data and optional image.
app.post("/create", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const data = new studentModel({
      ...req.body,
      image: req.file ? req.file.filename : ""
    });

    await data.save();  

    res.json({
      success: true,
      message: "data saved successfully",
      data: data
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// API: POST /register expects email, password, and optional role.
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = "student";

    const user = new userModel({
      email,
      password: hashedPassword,
      role: safeRole
    });

    await user.save();

    if (safeRole === "student") {
      await studentModel.create({
        userId: user._id,
        email: user.email,
        name: email.split("@")[0]
      });
    }

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// API: POST /login expects email and password, then returns a signed JWT and role.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "1d" });

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// API: GET /getData returns all student records for admins.
app.get("/getData", auth, admin, async (req, res) => {
  const data = await studentModel.find();
  res.json({ success: true, data });
});

// API: GET /students/me returns the signed-in student's profile record.
app.get("/students/me", auth, async (req, res) => {
  try {
    const student = await studentModel.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found"
      });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API: PUT /update expects a student object with _id and replacement fields.
app.put("/update", auth, admin, async (req, res) => {
  const { _id, ...rest } = req.body;

  const data = await studentModel.updateOne({ _id: _id }, rest);

  res.send({ success: true, message: "data updated successfully", data: data });
});

// API: DELETE /delete/:id removes one student record by id.
app.delete("/delete/:id", auth, admin, async (req, res) => {
  const id = req.params.id;
  const data = await studentModel.deleteOne({ _id: id });
  res.send({ success: true, message: "data deleted successfully", data: data });
});

require("dotenv").config();



console.log("Mongo URL:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
