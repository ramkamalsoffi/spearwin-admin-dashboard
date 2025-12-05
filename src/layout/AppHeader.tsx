import { useEffect, useRef } from "react";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
        {/* Left side - Hamburger Menu */}
        <div className="flex items-center">
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Toggle Sidebar"
          >
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.585788 0.335786 0.25 0.75 0.25H17.25C17.6642 0.25 18 0.585786 18 1C18 1.41421 17.6642 1.75 17.25 1.75H0.75C0.335786 1.75 0 1.41422 0 1ZM0 11C0 10.5858 0.335786 10.25 0.75 10.25H17.25C17.6642 10.25 18 10.5858 18 11C18 11.4142 17.6642 11.75 17.25 11.75H0.75C0.335786 11.75 0 11.4142 0 11ZM0.75 5.25C0.335786 5.25 0 5.58579 0 6C0 6.41421 0.335786 6.75 0.75 6.75H9.75C10.1642 6.75 10.5 6.41421 10.5 6C10.5 5.58579 10.1642 5.25 9.75 5.25H0.75Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Right side - Search and Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                {/* <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-400"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span> */}
                {/* <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search"
                  className="h-10 w-[280px] rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                /> */}
              </div>
            </form>
          </div>

          {/* User Profile */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;