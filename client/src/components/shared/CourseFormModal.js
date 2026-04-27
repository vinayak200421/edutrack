// Provides the admin modal for creating courses.
import React from "react";

// Renders course creation form; receives form state and action handlers.
function CourseFormModal({ value, onChange, onClose, onSubmit, loading }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm'>
      <div className='w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-600'>
              Courses
            </p>
            <h3 className='mt-2 text-2xl font-bold text-slate-900'>Add a New Course</h3>
            <p className='mt-2 text-sm text-slate-500'>
              Capture the course basics so students can start registering right away.
            </p>
          </div>
          <button
            onClick={onClose}
            className='rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50'
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className='mt-6 grid gap-4 md:grid-cols-2'>
          <label className='block'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Course Name</span>
            <input
              name='name'
              value={value.name}
              onChange={onChange}
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='Machine Learning'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Course Code</span>
            <input
              name='code'
              value={value.code}
              onChange={onChange}
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='ML101'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Credits</span>
            <input
              name='credits'
              type='number'
              min='1'
              value={value.credits}
              onChange={onChange}
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='4'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Instructor</span>
            <input
              name='instructor'
              value={value.instructor}
              onChange={onChange}
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='Dr. Rao'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Max Seats</span>
            <input
              name='maxSeats'
              type='number'
              min='1'
              value={value.maxSeats}
              onChange={onChange}
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='60'
            />
          </label>

          <label className='block md:col-span-2'>
            <span className='mb-2 block text-sm font-semibold text-slate-700'>Description</span>
            <textarea
              name='description'
              value={value.description}
              onChange={onChange}
              rows='4'
              className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
              placeholder='Foundational concepts, assignments, and evaluation details.'
            />
          </label>

          <div className='md:col-span-2 flex justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? "Saving..." : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseFormModal;
