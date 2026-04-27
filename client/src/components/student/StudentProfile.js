// Shows the current student's linked profile and profile actions.
import React from "react";
import EmptyState from "../shared/EmptyState";
import { FaArrowRight } from "react-icons/fa";

// Renders profile summary; receives loading/profile/navigation props.
function StudentProfile({ loadingProfile, profile, setActiveTab, navigate }) {
  if (loadingProfile) {
    return <EmptyState title='Loading profile...' description='Pulling your student information.' />;
  }

  if (!profile) {
    return (
      <EmptyState
        title='Profile not linked yet'
        description='Your account exists, but no student profile record is linked to it yet.'
      />
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[1.1fr,0.9fr]'>
      <div className='rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600'>
          Student Profile
        </p>
        <h3 className='mt-2 text-3xl font-bold text-slate-900'>{profile.name || "Unnamed Student"}</h3>
        <p className='mt-2 text-sm text-slate-500'>
          Keep your registration profile accurate so admins can manage enrollments smoothly.
        </p>

        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl bg-slate-50 px-4 py-4'>
            <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Email</p>
            <p className='mt-2 font-semibold text-slate-900'>{profile.email || "-"}</p>
          </div>
          <div className='rounded-2xl bg-slate-50 px-4 py-4'>
            <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Grade</p>
            <p className='mt-2 font-semibold text-slate-900'>{profile.grade || "-"}</p>
          </div>
          <div className='rounded-2xl bg-slate-50 px-4 py-4'>
            <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Class</p>
            <p className='mt-2 font-semibold text-slate-900'>{profile.class || "-"}</p>
          </div>
          <div className='rounded-2xl bg-slate-50 px-4 py-4'>
            <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Home Mobile</p>
            <p className='mt-2 font-semibold text-slate-900'>{profile.homeMobile || "-"}</p>
          </div>
          <div className='rounded-2xl bg-slate-50 px-4 py-4 md:col-span-2'>
            <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Address</p>
            <p className='mt-2 font-semibold text-slate-900'>{profile.address || "-"}</p>
          </div>
        </div>
      </div>

      <div className='rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600'>
          Quick Actions
        </p>
        <div className='mt-5 space-y-4'>
          <button
            onClick={() => setActiveTab("available-courses")}
            className='flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-4 text-left text-white transition hover:bg-slate-800'
          >
            <span>
              <span className='block text-base font-semibold'>Browse Available Courses</span>
              <span className='mt-1 block text-sm text-slate-300'>
                Find new courses and register for open seats.
              </span>
            </span>
            <FaArrowRight />
          </button>
          <button
            onClick={() => navigate("/student-details", { state: { student: profile } })}
            className='flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:bg-slate-50'
          >
            <span>
              <span className='block text-base font-semibold text-slate-900'>View Full Profile</span>
              <span className='mt-1 block text-sm text-slate-500'>
                Open the detailed profile view for all student fields.
              </span>
            </span>
            <FaArrowRight className='text-slate-400' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
