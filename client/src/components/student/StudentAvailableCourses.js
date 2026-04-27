// Shows available courses and enrollment actions for students.
import React from "react";
import EmptyState from "../shared/EmptyState";
import SeatProgress from "../shared/SeatProgress";

// Renders course cards; receives course/loading/action props and returns available-course UI.
function StudentAvailableCourses({
  loadingCourses,
  filteredCourses,
  enrolledCourseIds,
  busyCourseId,
  enrollInCourse,
}) {
  if (loadingCourses) {
    return (
      <EmptyState
        title='Loading courses...'
        description='We are pulling the latest course catalog for you.'
      />
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <EmptyState
        title='No matching courses'
        description='Try a different search term or wait for more courses to be published by the admin.'
      />
    );
  }

  return (
    <div className='grid gap-5 lg:grid-cols-2 xl:grid-cols-3'>
      {filteredCourses.map((course) => {
        const alreadyEnrolled = enrolledCourseIds.has(course._id);
        const isFull = course.seatsLeft === 0;

        return (
          <div key={course._id} className='rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600'>
                  {course.code}
                </p>
                <h3 className='mt-2 text-2xl font-bold text-slate-900'>{course.name}</h3>
                <p className='mt-2 text-sm text-slate-500'>Instructor: {course.instructor}</p>
              </div>
              <div className='rounded-2xl bg-cyan-50 px-4 py-3 text-center text-cyan-700'>
                <p className='text-xs uppercase tracking-[0.2em]'>Credits</p>
                <p className='mt-2 text-2xl font-bold'>{course.credits}</p>
              </div>
            </div>

            <p className='mt-4 text-sm text-slate-500'>
              {course.description || "Course overview will be added soon."}
            </p>

            <div className='mt-5'>
              <SeatProgress enrolledCount={course.enrolledCount} maxSeats={course.maxSeats} />
            </div>

            <button
              onClick={() => enrollInCourse(course._id)}
              disabled={alreadyEnrolled || isFull || busyCourseId === course._id}
              className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                alreadyEnrolled
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : isFull
                  ? "cursor-not-allowed bg-rose-100 text-rose-500"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {busyCourseId === course._id
                ? "Processing..."
                : alreadyEnrolled
                ? "Already Enrolled"
                : isFull
                ? "Course Full"
                : "Enroll"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default StudentAvailableCourses;
