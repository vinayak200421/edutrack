// Provides the shared shell for dashboard pages with sidebar, header, stats, and content.
import React from "react";

// Renders a dashboard layout; receives shell content props and returns the page frame.
function DashboardLayout({ sidebar, title, subtitle, stats, actions, children }) {
  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='flex min-h-screen'>
        {sidebar}

        <main className='flex-1 px-4 py-6 md:px-8'>
          <div className='mx-auto max-w-7xl'>
            <header className='rounded-[28px] bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200'>
              <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.35em] text-sky-600'>
                    Dashboard
                  </p>
                  <h2 className='mt-2 text-3xl font-bold text-slate-900'>{title}</h2>
                  <p className='mt-2 max-w-2xl text-sm text-slate-500'>{subtitle}</p>
                </div>
                <div className='flex flex-wrap gap-3'>{actions}</div>
              </div>

              <div className='mt-6 grid gap-4 md:grid-cols-3'>
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className='rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4'
                  >
                    <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-500'>
                      {stat.label}
                    </p>
                    <p className='mt-3 text-3xl font-bold text-slate-900'>{stat.value}</p>
                    <p className='mt-1 text-sm text-slate-500'>{stat.helper}</p>
                  </div>
                ))}
              </div>
            </header>

            <section className='mt-6'>{children}</section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
