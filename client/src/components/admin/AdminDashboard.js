// Coordinates the admin dashboard data, actions, and tabbed management pages.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaClipboardList, FaPlus, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import StudentForm from "../StudentForm";
import AdminCoursesPage from "./AdminCoursesPage";
import AdminEnrollmentsPage from "./AdminEnrollmentsPage";
import AdminSidebar from "./AdminSidebar";
import AdminStudentsPage from "./AdminStudentsPage";
import DashboardLayout from "../shared/DashboardLayout";
import CourseFormModal from "../shared/CourseFormModal";

// Renders admin workflows; receives onLogout and returns the dashboard layout.
function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);
  const [studentsSearch, setStudentsSearch] = useState("");
  const [coursesSearch, setCoursesSearch] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [studentFormData, setStudentFormData] = useState({});
  const [editingStudent, setEditingStudent] = useState({});
  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    credits: "",
    description: "",
    instructor: "",
    maxSeats: "",
  });
  const [courseSaving, setCourseSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCourseStudents, setLoadingCourseStudents] = useState(false);

  // API: GET /getData returns all student records for admin management.
  const fetchStudents = async () => {
    setLoadingStudents(true);

    try {
      const response = await axios.get("/getData");
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // API: GET /api/courses returns course catalog data with seat counts.
  const fetchCourses = async () => {
    setLoadingCourses(true);

    try {
      const response = await axios.get("/api/courses");
      if (response.data.success) {
        setCourses(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedCourseId((prev) => prev || response.data.data[0]._id);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // API: GET /api/courses/:id/students returns enrolled students for one course.
  const fetchCourseStudents = async (courseId) => {
    if (!courseId) {
      setSelectedCourseStudents([]);
      return;
    }

    setLoadingCourseStudents(true);

    try {
      const response = await axios.get(`/api/courses/${courseId}/students`);
      if (response.data.success) {
        setSelectedCourseStudents(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch enrollments");
    } finally {
      setLoadingCourseStudents(false);
    }
  };

  // Loads students and courses together so the dashboard opens with complete summary data.
  useEffect(() => {
    const bootstrapDashboard = async () => {
      setLoadingStudents(true);
      setLoadingCourses(true);

      try {
        const [studentsResponse, coursesResponse] = await Promise.all([
          axios.get("/getData"),
          axios.get("/api/courses"),
        ]);

        if (studentsResponse.data.success) {
          setStudents(studentsResponse.data.data);
        }

        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.data);
          if (coursesResponse.data.data.length > 0) {
            setSelectedCourseId((prev) => prev || coursesResponse.data.data[0]._id);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoadingStudents(false);
        setLoadingCourses(false);
      }
    };

    bootstrapDashboard();
  }, []);

  // Refreshes enrollment roster only when the enrollments tab needs it.
  useEffect(() => {
    if (activeTab === "enrollments" && selectedCourseId) {
      fetchCourseStudents(selectedCourseId);
    }
  }, [activeTab, selectedCourseId]);

  // Updates the add-student form state from text, checkbox, and file inputs.
  const handleStudentFormChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setStudentFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files && files.length > 0 ? files[0] : value,
    }));
  };

  // Updates the edit-student form state from text, checkbox, and file inputs.
  const handleEditStudentChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setEditingStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files && files.length > 0 ? files[0] : value,
    }));
  };

  // API: POST /create expects multipart student data and optional image.
  const submitStudent = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      Object.keys(studentFormData).forEach((key) => form.append(key, studentFormData[key]));

      const response = await axios.post("/create", form);
      if (response.data.success) {
        toast.success("Student added successfully");
        setShowStudentForm(false);
        setStudentFormData({});
        fetchStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    }
  };

  // API: PUT /update expects an existing student object with _id.
  const updateStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("/update", editingStudent);
      if (response.data.success) {
        toast.success("Student updated successfully");
        setShowEditStudentForm(false);
        fetchStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update student");
    }
  };

  // API: DELETE /delete/:id removes a student record by id.
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`/delete/${id}`);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  // Updates the course form state from modal inputs.
  const handleCourseFormChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  // API: POST /api/courses expects course fields with numeric credits and maxSeats.
  const createCourse = async (e) => {
    e.preventDefault();
    setCourseSaving(true);

    try {
      const response = await axios.post("/api/courses", {
        ...courseForm,
        credits: Number(courseForm.credits),
        maxSeats: Number(courseForm.maxSeats),
      });

      if (response.data.success) {
        toast.success("Course added successfully");
        setShowCourseModal(false);
        setCourseForm({
          name: "",
          code: "",
          credits: "",
          description: "",
          instructor: "",
          maxSeats: "",
        });
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add course");
    } finally {
      setCourseSaving(false);
    }
  };

  // API: DELETE /api/courses/:id removes a course and its enrollments.
  const removeCourse = async (courseId) => {
    try {
      const response = await axios.delete(`/api/courses/${courseId}`);
      if (response.data.success) {
        toast.success("Course removed successfully");
        if (selectedCourseId === courseId) {
          setSelectedCourseId("");
          setSelectedCourseStudents([]);
        }
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  const filteredStudents = students.filter((student) =>
    (student.name || "").toLowerCase().includes(studentsSearch.toLowerCase())
  );

  const filteredCourses = courses.filter((course) => {
    const target = `${course.name} ${course.code} ${course.instructor}`.toLowerCase();
    return target.includes(coursesSearch.toLowerCase());
  });

  const selectedCourse = courses.find((course) => course._id === selectedCourseId);
  const navItems = [
    { id: "students", label: "Students", icon: FaUsers },
    { id: "courses", label: "Courses", icon: FaBookOpen },
    { id: "enrollments", label: "Enrollments", icon: FaClipboardList },
  ];

  return (
    <>
      <DashboardLayout
        sidebar={
          <AdminSidebar
            navItems={navItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={onLogout}
          />
        }
        title='Course Registration Portal'
        subtitle='Manage your student directory, publish courses, and monitor who has enrolled in each class.'
        stats={[
          { label: "Students", value: students.length, helper: "Active student records" },
          { label: "Courses", value: courses.length, helper: "Published course offerings" },
          {
            label: "Enrollments",
            value: courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0),
            helper: "Confirmed seats across all courses",
          },
        ]}
        actions={
          <>
            {activeTab === "students" && (
              <button
                onClick={() => setShowStudentForm(true)}
                className='inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
              >
                <FaPlus />
                Add Student
              </button>
            )}
            {activeTab === "courses" && (
              <button
                onClick={() => setShowCourseModal(true)}
                className='inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
              >
                <FaPlus />
                Add Course
              </button>
            )}
          </>
        }
      >
        {activeTab === "students" && (
          <AdminStudentsPage
            loadingStudents={loadingStudents}
            studentsSearch={studentsSearch}
            setStudentsSearch={setStudentsSearch}
            filteredStudents={filteredStudents}
            navigate={navigate}
            setEditingStudent={setEditingStudent}
            setShowEditStudentForm={setShowEditStudentForm}
            deleteStudent={deleteStudent}
          />
        )}

        {activeTab === "courses" && (
          <AdminCoursesPage
            loadingCourses={loadingCourses}
            coursesSearch={coursesSearch}
            setCoursesSearch={setCoursesSearch}
            filteredCourses={filteredCourses}
            setActiveTab={setActiveTab}
            setSelectedCourseId={setSelectedCourseId}
            removeCourse={removeCourse}
          />
        )}

        {activeTab === "enrollments" && (
          <AdminEnrollmentsPage
            courses={courses}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedCourse={selectedCourse}
            loadingCourseStudents={loadingCourseStudents}
            selectedCourseStudents={selectedCourseStudents}
          />
        )}
      </DashboardLayout>

      {showStudentForm && (
        <StudentForm
          handleSubmit={submitStudent}
          handleOnChange={handleStudentFormChange}
          handleclose={() => setShowStudentForm(false)}
          rest={studentFormData}
        />
      )}

      {showEditStudentForm && (
        <StudentForm
          handleSubmit={updateStudent}
          handleOnChange={handleEditStudentChange}
          handleclose={() => setShowEditStudentForm(false)}
          rest={editingStudent}
        />
      )}

      {showCourseModal && (
        <CourseFormModal
          value={courseForm}
          onChange={handleCourseFormChange}
          onClose={() => setShowCourseModal(false)}
          onSubmit={createCourse}
          loading={courseSaving}
        />
      )}
    </>
  );
}

export default AdminDashboard;
