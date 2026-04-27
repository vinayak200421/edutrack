// Renders the admin dashboard navigation sidebar.
import React from "react";
import { FaArrowRight, FaSignOutAlt } from "react-icons/fa";

// Displays admin tabs and logout control; receives nav state and action handlers.
function AdminSidebar({ navItems, activeTab, onTabChange, onLogout }) {
  return (
    <aside className='w-full max-w-[280px] bg-slate-800 px-6 py-8 text-white'>
      <div className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-slate-300'>
          EduTrack
        </p>
        <h1 className='mt-3 text-3xl font-bold'>Admin Console</h1>
        <p className='mt-3 text-sm text-slate-300'>
          Manage learners, courses, and enrollments from one place.
        </p>
      </div>

      <nav className='space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                active
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/5 text-slate-100 hover:bg-white/10"
              }`}
            >
              <span className='flex items-center gap-3 font-medium'>
                <Icon className='text-base' />
                {item.label}
              </span>
              <FaArrowRight className={`text-xs ${active ? "opacity-100" : "opacity-40"}`} />
            </button>
          );
        })}
      </nav>

      <div className='mt-10 rounded-3xl bg-white/10 p-5 backdrop-blur'>
        <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>Signed in as</p>
        <p className='mt-2 text-lg font-semibold capitalize'>Administrator</p>
        <button
          onClick={onLogout}
          className='mt-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100'
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
