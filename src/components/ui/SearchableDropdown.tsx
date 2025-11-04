import { useState, useRef, useEffect } from "react";

interface SearchableDropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableDropdownOption[];
  isLoading?: boolean;
  onSearch?: (searchTerm: string) => void;
  disabled?: boolean;
}

export default function SearchableDropdown({
  placeholder,
  value,
  onChange,
  options,
  isLoading = false,
  onSearch,
  disabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  // Handle option selection
  const handleSelect = (option: SearchableDropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          cursor-pointer flex items-center justify-between
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        `}
      >
        <span
          className={`${
            selectedOption ? "text-gray-900" : "text-gray-500"
          } truncate`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && !disabled && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 mx-auto"></div>
                <p className="mt-2 text-sm">Loading...</p>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No options found</p>
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors
                    ${value === option.value ? "bg-blue-100 font-medium" : ""}
                  `}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

