// Shows course-level enrollment rosters for admins.
import React from "react";
import EmptyState from "../shared/EmptyState";
import SeatProgress from "../shared/SeatProgress";

// Renders enrollments for the selected course; receives course and roster props.
function AdminEnrollmentsPage({
  courses,
  selectedCourseId,
  setSelectedCourseId,
  selectedCourse,
  loadingCourseStudents,
  selectedCourseStudents,
}) {
  return (
    <div className='grid gap-6 xl:grid-cols-[320px,1fr]'>
      <div className='rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200'>
        <h3 className='text-lg font-bold text-slate-900'>Courses</h3>
        <p className='mt-1 text-sm text-slate-500'>
          Pick a course to inspect its enrolled students.
        </p>

        <div className='mt-5 space-y-3'>
          {courses.map((course) => (
            <button
              key={course._id}
              onClick={() => setSelectedCourseId(course._id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                selectedCourseId === course._id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.25em] opacity-70'>{course.code}</p>
                  <p className='mt-1 font-semibold'>{course.name}</p>
                </div>
                <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-semibold'>
                  {course.enrolledCount}/{course.maxSeats}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className='rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200'>
        {selectedCourse ? (
          <>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-600'>
                  {selectedCourse.code}
                </p>
                <h3 className='mt-2 text-2xl font-bold text-slate-900'>{selectedCourse.name}</h3>
                <p className='mt-2 text-sm text-slate-500'>
                  {selectedCourse.instructor} • {selectedCourse.credits} credits
                </p>
              </div>
              <div className='w-full max-w-sm'>
                <SeatProgress
                  enrolledCount={selectedCourse.enrolledCount}
                  maxSeats={selectedCourse.maxSeats}
                />
              </div>
            </div>

            <div className='mt-6'>
              {loadingCourseStudents ? (
                <EmptyState
                  title='Loading enrolled students...'
                  description='Fetching the latest enrollment roster for this course.'
                />
              ) : selectedCourseStudents.length === 0 ? (
                <EmptyState
                  title='No one has enrolled yet'
                  description='Once students enroll in this course, their details will appear here.'
                />
              ) : (
                <div className='overflow-hidden rounded-3xl border border-slate-200'>
                  <table className='min-w-full divide-y divide-slate-200'>
                    <thead className='bg-slate-50'>
                      <tr className='text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                        <th className='px-6 py-4'>Student</th>
                        <th className='px-6 py-4'>Email</th>
                        <th className='px-6 py-4'>Grade</th>
                        <th className='px-6 py-4'>Class</th>
                        <th className='px-6 py-4'>Enrolled At</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100 bg-white text-sm text-slate-700'>
                      {selectedCourseStudents.map((entry) => (
                        <tr key={entry._id}>
                          <td className='px-6 py-4 font-semibold text-slate-900'>
                            {entry.student.name || "Unnamed Student"}
                          </td>
                          <td className='px-6 py-4'>{entry.student.email || "-"}</td>
                          <td className='px-6 py-4'>{entry.student.grade || "-"}</td>
                          <td className='px-6 py-4'>{entry.student.class || "-"}</td>
                          <td className='px-6 py-4'>
                            {new Date(entry.enrolledAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            title='Select a course'
            description='Choose a course from the left panel to inspect its enrolled students.'
          />
        )}
      </div>
    </div>
  );
}

export default AdminEnrollmentsPage;
