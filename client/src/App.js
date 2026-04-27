// Configures app routing, auth guards, and global Axios authentication behavior.
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/admin/AdminDashboard";
import StudentDashboard from "./components/student/StudentDashboard";
import DetailedStudentProfile from "./pages/StudentProfile";
import { API_BASE_URL } from "./config/api";

axios.defaults.baseURL = API_BASE_URL;

// Clears persisted auth values; accepts no params and returns nothing.
const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Returns the auth token currently saved in local storage.
const getStoredToken = () => localStorage.getItem("token");
// Returns the current user's saved role.
const getStoredRole = () => localStorage.getItem("role");

// Registers Axios hooks once so every API call sends the auth token and handles expired sessions.
if (!window.__edutrackAxiosInterceptorAdded) {
  axios.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.authorization = token;
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearAuthStorage();
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  window.__edutrackAxiosInterceptorAdded = true;
}

// Logs out the current user and redirects to the login screen.
function logout() {
  clearAuthStorage();
  window.location.href = "/login";
}

// Protects routes from unauthenticated access; receives children and returns the guarded UI.
function ProtectedRoute({ children }) {
  if (!getStoredToken()) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

// Protects admin-only routes; receives children and returns the guarded admin UI.
function AdminRoute({ children }) {
  if (!getStoredToken()) {
    return <Navigate to='/login' replace />;
  }

  if (getStoredRole() !== "admin") {
    return <Navigate to='/' replace />;
  }

  return children;
}

// Renders login or registration only for signed-out users; mode selects the auth page.
function AuthPage({ mode }) {
  if (getStoredToken()) {
    return <Navigate to={getStoredRole() === "admin" ? "/admin" : "/"} replace />;
  }

  return mode === "register" ? <Register /> : <Login />;
}

// Shows a selected student profile from router state; redirects when no student is supplied.
function StudentDetailsRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    return <Navigate to={getStoredRole() === "admin" ? "/admin" : "/"} replace />;
  }

  return (
    <div className='min-h-screen bg-slate-100 px-4 py-8'>
      <div className='mx-auto flex max-w-6xl items-center justify-between rounded-3xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-sky-600'>
            EduTrack
          </p>
          <h1 className='text-2xl font-bold text-slate-900'>Student Profile</h1>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => navigate(getStoredRole() === "admin" ? "/admin" : "/")}
            className='rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50'
          >
            Back
          </button>
          <button
            onClick={logout}
            className='rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'
          >
            Logout
          </button>
        </div>
      </div>

      <div className='mx-auto mt-8 max-w-5xl'>
        <DetailedStudentProfile
          student={student}
          handleBack={() => navigate(getStoredRole() === "admin" ? "/admin" : "/")}
        />
      </div>
    </div>
  );
}

// Renders the application routes and shared toast container.
function App() {
  return (
    <>
      <ToastContainer position='top-right' autoClose={2500} hideProgressBar />
      <Routes>
        <Route path='/login' element={<AuthPage mode='login' />} />
        <Route path='/register' element={<AuthPage mode='register' />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              {getStoredRole() === "admin" ? (
                <Navigate to='/admin' replace />
              ) : (
                <StudentDashboard onLogout={logout} />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <AdminRoute>
              <AdminDashboard onLogout={logout} />
            </AdminRoute>
          }
        />
        <Route
          path='/student-details'
          element={
            <ProtectedRoute>
              <StudentDetailsRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={<Navigate to={getStoredRole() === "admin" ? "/admin" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
