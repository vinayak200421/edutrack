// Displays reusable empty, loading, and no-results messages.
import React from "react";

// Renders an empty state; receives title and description text.
function EmptyState({ title, description }) {
  return (
    <div className='rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm'>
      <h3 className='text-xl font-semibold text-slate-900'>{title}</h3>
      <p className='mx-auto mt-2 max-w-xl text-sm text-slate-500'>{description}</p>
    </div>
  );
}

export default EmptyState;
