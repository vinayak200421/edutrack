// Renders the registration page for student and admin accounts.
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Registers a new account; posts email/password/role and returns nothing.
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // API: POST /register expects email, password, and role.
  const handleRegister = async () => {
    try {
      const res = await axios.post("/register", {
        email,
        password,
        role,
      });

      if (res.data.success) {
        toast.success("Registered successfully! Now login.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 px-4 py-10'>
      <div className='grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-[1.05fr,0.95fr]'>
        <div className='hidden bg-cyan-900 p-10 text-white lg:block'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200'>
            EduTrack
          </p>
          <h1 className='mt-6 text-4xl font-bold leading-tight'>
            Create an account for the new course registration flow.
          </h1>
          <p className='mt-4 max-w-md text-sm text-cyan-100/80'>
            Student accounts get a personal dashboard. Admin accounts can create courses and manage
            enrollments across the portal.
          </p>
        </div>

        <div className='p-8 sm:p-10'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-sky-600'>Create Account</p>
          <h2 className='mt-3 text-3xl font-bold text-slate-900'>Register for EduTrack</h2>
          <p className='mt-3 text-sm text-slate-500'>
            Pick a role and create the account you want to test with.
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
                placeholder='Choose a password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              />
            </label>

            <label className='block'>
              <span className='mb-2 block text-sm font-semibold text-slate-700'>Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              >
                <option value='student'>Student</option>
                <option value='admin'>Admin</option>
              </select>
            </label>

            <button
              onClick={handleRegister}
              className='w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
