import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;