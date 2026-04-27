// Coordinates the student dashboard data, enrollment actions, and tabbed pages.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaLayerGroup, FaUserGraduate } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../shared/DashboardLayout";
import SearchInput from "../shared/SearchInput";
import StudentAvailableCourses from "./StudentAvailableCourses";
import StudentMyCourses from "./StudentMyCourses";
import StudentProfile from "./StudentProfile";
import StudentSidebar from "./StudentSidebar";

// Renders student workflows; receives onLogout and returns the dashboard layout.
function StudentDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available-courses");
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [coursesSearch, setCoursesSearch] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState("");

  // API: GET /api/courses returns available courses with seat status.
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await axios.get("/api/courses");
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // API: GET /api/enrollments/my returns the current student's active enrollments.
  const fetchEnrollments = async () => {
    setLoadingEnrollments(true);
    try {
      const response = await axios.get("/api/enrollments/my");
      if (response.data.success) {
        setMyEnrollments(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch enrollments");
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // API: GET /students/me returns the current user's linked student profile.
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await axios.get("/students/me");
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchProfile();
  }, []);

  const enrolledCourseIds = new Set(
    myEnrollments.map((enrollment) => enrollment.course?._id).filter(Boolean)
  );

  const filteredCourses = courses.filter((course) => {
    const target = `${course.name} ${course.code} ${course.instructor}`.toLowerCase();
    return target.includes(coursesSearch.toLowerCase());
  });

  // API: POST /api/enrollments expects a courseId and enrolls the current student.
  const enrollInCourse = async (courseId) => {
    setBusyCourseId(courseId);
    try {
      const response = await axios.post("/api/enrollments", { courseId });
      if (response.data.success) {
        toast.success("Enrolled successfully");
        await Promise.all([fetchCourses(), fetchEnrollments()]);
        setActiveTab("my-courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll");
    } finally {
      setBusyCourseId("");
    }
  };

  // API: DELETE /api/enrollments/:courseId drops the current student's course enrollment.
  const dropCourse = async (courseId) => {
    setBusyCourseId(courseId);
    try {
      const response = await axios.delete(`/api/enrollments/${courseId}`);
      if (response.data.success) {
        toast.success("Course dropped successfully");
        await Promise.all([fetchCourses(), fetchEnrollments()]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to drop course");
    } finally {
      setBusyCourseId("");
    }
  };

  const navItems = [
    { id: "my-courses", label: "My Courses", icon: FaLayerGroup },
    { id: "available-courses", label: "Available Courses", icon: FaBookOpen },
    { id: "profile", label: "Profile", icon: FaUserGraduate },
  ];

  return (
    <DashboardLayout
      sidebar={
        <StudentSidebar
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />
      }
      title='My Learning Journey'
      subtitle='Explore open courses, track your registered classes, and keep an eye on your student profile.'
      stats={[
        { label: "My Courses", value: myEnrollments.length, helper: "Current active enrollments" },
        { label: "Available Courses", value: courses.length, helper: "Open options to register" },
        {
          label: "Profile Status",
          value: profile ? "Ready" : "Pending",
          helper: "Student record linked to your account",
        },
      ]}
      actions={
        <div className='w-full max-w-md'>
          <SearchInput
            value={coursesSearch}
            onChange={(e) => setCoursesSearch(e.target.value)}
            placeholder='Search courses by name, code, or instructor'
          />
        </div>
      }
    >
      {activeTab === "available-courses" && (
        <StudentAvailableCourses
          loadingCourses={loadingCourses}
          filteredCourses={filteredCourses}
          enrolledCourseIds={enrolledCourseIds}
          busyCourseId={busyCourseId}
          enrollInCourse={enrollInCourse}
        />
      )}

      {activeTab === "my-courses" && (
        <StudentMyCourses
          loadingEnrollments={loadingEnrollments}
          myEnrollments={myEnrollments}
          busyCourseId={busyCourseId}
          dropCourse={dropCourse}
        />
      )}

      {activeTab === "profile" && (
        <StudentProfile
          loadingProfile={loadingProfile}
          profile={profile}
          setActiveTab={setActiveTab}
          navigate={navigate}
        />
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;
