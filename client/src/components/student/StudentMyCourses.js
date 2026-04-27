// Shows the student's active course enrollments.
import React from "react";
import EmptyState from "../shared/EmptyState";
import SeatProgress from "../shared/SeatProgress";

// Renders enrolled course cards; receives enrollment state and drop handler.
function StudentMyCourses({ loadingEnrollments, myEnrollments, busyCourseId, dropCourse }) {
  if (loadingEnrollments) {
    return (
      <EmptyState
        title='Loading your courses...'
        description='Gathering your active enrollment list.'
      />
    );
  }

  if (myEnrollments.length === 0) {
    return (
      <EmptyState
        title='No active enrollments yet'
        description='Browse the available courses tab and enroll in the classes you want to take.'
      />
    );
  }

  return (
    <div className='grid gap-5 lg:grid-cols-2'>
      {myEnrollments.map((enrollment) => {
        const course = enrollment.course;

        if (!course) {
          return null;
        }

        return (
          <div key={enrollment._id} className='rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600'>
                  {course.code}
                </p>
                <h3 className='mt-2 text-2xl font-bold text-slate-900'>{course.name}</h3>
                <p className='mt-2 text-sm text-slate-500'>{course.instructor}</p>
              </div>
              <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>
                Enrolled
              </span>
            </div>

            <div className='mt-5 grid gap-4 md:grid-cols-2'>
              <div className='rounded-2xl bg-slate-50 px-4 py-4'>
                <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Credits</p>
                <p className='mt-2 font-semibold text-slate-900'>{course.credits}</p>
              </div>
              <div className='rounded-2xl bg-slate-50 px-4 py-4'>
                <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Enrolled At</p>
                <p className='mt-2 font-semibold text-slate-900'>
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='mt-5'>
              <SeatProgress enrolledCount={course.enrolledCount} maxSeats={course.maxSeats} />
            </div>

            <button
              onClick={() => dropCourse(course._id)}
              disabled={busyCourseId === course._id}
              className='mt-6 w-full rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {busyCourseId === course._id ? "Dropping..." : "Drop Course"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default StudentMyCourses;
