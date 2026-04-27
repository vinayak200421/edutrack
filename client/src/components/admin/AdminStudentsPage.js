// Shows the admin student table with search and record actions.
import React from "react";
import { FaUserGraduate } from "react-icons/fa";
import EmptyState from "../shared/EmptyState";
import SearchInput from "../shared/SearchInput";
import { getApiAssetUrl } from "../../config/api";

// Renders student rows; receives loading/search/data/action props and returns the students page.
function AdminStudentsPage({
  loadingStudents,
  studentsSearch,
  setStudentsSearch,
  filteredStudents,
  navigate,
  setEditingStudent,
  setShowEditStudentForm,
  deleteStudent,
}) {
  return (
    <div className='space-y-6'>
      <SearchInput
        value={studentsSearch}
        onChange={(e) => setStudentsSearch(e.target.value)}
        placeholder='Search students by name'
      />

      {loadingStudents ? (
        <EmptyState title='Loading students...' description='Fetching your student records.' />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title='No students found'
          description='Add your first student record or adjust the search term to find an existing record.'
        />
      ) : (
        <div className='overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-slate-200'>
              <thead className='bg-slate-50'>
                <tr className='text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                  <th className='px-6 py-4'>Student</th>
                  <th className='px-6 py-4'>Address</th>
                  <th className='px-6 py-4'>Grade</th>
                  <th className='px-6 py-4'>Class</th>
                  <th className='px-6 py-4'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className='text-sm text-slate-700'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {student.image ? (
                          <img
                            src={getApiAssetUrl(`/uploads/${student.image}`)}
                            alt={student.name || "Student"}
                            className='h-12 w-12 rounded-2xl object-cover'
                          />
                        ) : (
                          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500'>
                            <FaUserGraduate />
                          </div>
                        )}
                        <div>
                          <p className='font-semibold text-slate-900'>{student.name}</p>
                          <p className='text-xs text-slate-500'>{student.email || "No email linked"}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>{student.address || "-"}</td>
                    <td className='px-6 py-4'>{student.grade || "-"}</td>
                    <td className='px-6 py-4'>{student.class || "-"}</td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap gap-2'>
                        <button
                          onClick={() => navigate("/student-details", { state: { student } })}
                          className='rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50'
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setShowEditStudentForm(true);
                          }}
                          className='rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-200'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStudent(student._id)}
                          className='rounded-xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudentsPage;
