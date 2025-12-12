import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FilterX } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  onSearchFromHistory?: (term: string) => void;
  onCommitSearch?: (term: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  searchHistory = [],
  onClearHistory,
  onSearchFromHistory,
  onCommitSearch,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isFilterActive = searchTerm !== '' || selectedCategory !== '';

  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange('');
  };

  const handleHistoryClick = (term: string) => {
    onSearchFromHistory?.(term);
    setIsInputFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowHistory =
    isInputFocused &&
    searchHistory.length > 0 &&
    searchTerm.trim() === '';

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
      ref={containerRef}
    >
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* SEARCH */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />

          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onCommitSearch?.(e.currentTarget.value);
                setIsInputFocused(false);
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          {/* HISTORIAL */}
          {shouldShowHistory && (
            <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
              <div className="flex justify-between px-3 py-2 border-b dark:border-gray-600 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Búsquedas recientes
                <button
                  className="text-red-500 hover:underline"
                  onClick={onClearHistory}
                >
                  Borrar todo
                </button>
              </div>
              <ul className="max-h-40 overflow-y-auto">
                {searchHistory.map((term, i) => (
                  <li key={i}>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center gap-2"
                      onClick={() => handleHistoryClick(term)}
                    >
                      <Search className="w-4 h-4 text-gray-400" /> {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CATEGORÍAS */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg min-w-[200px] focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* BOTÓN LIMPIAR */}
        {isFilterActive && (
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <FilterX className="w-4 h-4 mr-2" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
