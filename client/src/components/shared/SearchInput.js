// Provides a reusable search input with an icon.
import React from "react";
import { FaSearch } from "react-icons/fa";

// Renders a controlled search field; receives value, onChange, and placeholder.
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>
      <FaSearch className='text-slate-400' />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
      />
    </div>
  );
}

export default SearchInput;
