import type React from "react";
import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
  error = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen) setSearchTerm("");
    }
  };

  // Sync internal state with prop
  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is Option => !!option)
    .map((option) => option.text);

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className={`relative inline-block w-full ${isOpen ? "z-[100]" : "z-10"}`}>
        <div className="relative flex flex-col items-center">
          <div onClick={toggleDropdown} className="w-full">
            <div className={`mb-2 flex min-h-[42px] w-full rounded-md border bg-white py-1.5 pl-3 pr-3 shadow-sm transition focus-within:ring-1 ${
              error 
                ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" 
                : "border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500"
            } cursor-pointer`}>
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedValuesText.length > 0 ? (
                  selectedValuesText.map((text, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 py-0.5 pl-2 pr-1 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <span className="flex-initial max-w-full">{text}</span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(selectedOptions[index]);
                        }}
                        className="pl-1 text-gray-400 cursor-pointer hover:text-gray-600"
                      >
                        <svg
                          className="fill-current"
                          role="button"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                          />
                        </svg>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full p-1 pr-2 text-sm text-gray-400">
                    Select option
                  </div>
                )}
              </div>
              <div className="flex items-center py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  className="w-5 h-5 text-gray-400 outline-none cursor-pointer focus:outline-none"
                >
                  <svg
                    className={`stroke-current ${isOpen ? "rotate-180" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute left-0 z-[110] w-full bg-white rounded-md shadow-lg border border-gray-200 top-full mt-1 max-h-72 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 max-h-48">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No results found
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`hover:bg-gray-50 w-full cursor-pointer border-b border-gray-100 last:border-0`}
                        onClick={() => handleSelect(option.value)}
                      >
                        <div
                          className={`relative flex w-full items-center p-2.5 pl-3 ${
                            selectedOptions.includes(option.value)
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="mx-2 leading-6 text-sm">
                            {option.text}
                          </div>
                          {selectedOptions.includes(option.value) && (
                            <div className="absolute right-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
