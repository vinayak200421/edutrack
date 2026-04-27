// Renders the login page and stores the authenticated user's session.
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Logs in with email/password; posts credentials and returns nothing.
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // API: POST /login expects email and password, then returns success, token, and role.
  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", {
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        navigate(res.data.role === "admin" ? "/admin" : "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 px-4 py-10'>
      <div className='grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-[1.05fr,0.95fr]'>
        <div className='hidden bg-slate-900 p-10 text-white lg:block'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300'>
            EduTrack
          </p>
          <h1 className='mt-6 text-4xl font-bold leading-tight'>
            Welcome back to your course registration portal.
          </h1>
          <p className='mt-4 max-w-md text-sm text-slate-300'>
            Admins can manage students, courses, and enrollments. Students can explore available
            courses and manage their registered classes.
          </p>
        </div>

        <div className='p-8 sm:p-10'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-sky-600'>Sign In</p>
          <h2 className='mt-3 text-3xl font-bold text-slate-900'>Login to EduTrack</h2>
          <p className='mt-3 text-sm text-slate-500'>
            Use your registered email and password to continue.
          </p>

          <div className='mt-8 space-y-5'>
            <label className='block'>
              <span className='mb-2 block text-sm font-semibold text-slate-700'>Email</span>
              <input
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              />
            </label>

            <label className='block'>
              <span className='mb-2 block text-sm font-semibold text-slate-700'>Password</span>
              <input
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              />
            </label>

            <button
              onClick={handleLogin}
              className='w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
            >
              Login
            </button>
            <p className='mt-4 text-sm text-slate-500 text-center'>
  Don’t have an account?
  <span
    onClick={() => navigate("/register")}
    className='ml-1 cursor-pointer text-sky-600 font-semibold'
  >
    Register
  </span>
</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
