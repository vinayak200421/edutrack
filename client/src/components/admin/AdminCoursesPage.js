// Shows the admin course catalog with search, seat status, and course actions.
import React from "react";
import EmptyState from "../shared/EmptyState";
import SearchInput from "../shared/SearchInput";
import SeatProgress from "../shared/SeatProgress";

// Renders course cards; receives course state/action props and returns the courses page.
function AdminCoursesPage({
  loadingCourses,
  coursesSearch,
  setCoursesSearch,
  filteredCourses,
  setActiveTab,
  setSelectedCourseId,
  removeCourse,
}) {
  return (
    <div className='space-y-6'>
      <SearchInput
        value={coursesSearch}
        onChange={(e) => setCoursesSearch(e.target.value)}
        placeholder='Search courses by name, code, or instructor'
      />

      {loadingCourses ? (
        <EmptyState title='Loading courses...' description='Fetching available course inventory.' />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title='No courses published yet'
          description='Create the first course to start opening registration for students.'
        />
      ) : (
        <div className='grid gap-5 xl:grid-cols-2'>
          {filteredCourses.map((course) => (
            <div key={course._id} className='rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-600'>
                    {course.code}
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-slate-900'>{course.name}</h3>
                  <p className='mt-2 text-sm text-slate-500'>
                    {course.description || "No description added yet."}
                  </p>
                </div>
                <div className='rounded-2xl bg-slate-100 px-4 py-3 text-center'>
                  <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Credits</p>
                  <p className='mt-2 text-2xl font-bold text-slate-900'>{course.credits}</p>
                </div>
              </div>

              <div className='mt-5 grid gap-4 md:grid-cols-2'>
                <div className='rounded-2xl bg-slate-50 px-4 py-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Instructor</p>
                  <p className='mt-2 font-semibold text-slate-900'>{course.instructor}</p>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-4'>
                  <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Capacity</p>
                  <p className='mt-2 font-semibold text-slate-900'>{course.maxSeats} seats</p>
                </div>
              </div>

              <div className='mt-5'>
                <SeatProgress enrolledCount={course.enrolledCount} maxSeats={course.maxSeats} />
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                <button
                  onClick={() => {
                    setActiveTab("enrollments");
                    setSelectedCourseId(course._id);
                  }}
                  className='rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
                >
                  View Enrollments
                </button>
                <button
                  onClick={() => removeCourse(course._id)}
                  className='rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200'
                >
                  Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCoursesPage;
