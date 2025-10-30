import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  ChevronDownIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

// Custom sidebar icons
const DashboardIcon = () => <img src="/images/sidebar-icons/dashboard-icon.png" alt="Dashboard" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const AdminIcon = () => <img src="/images/sidebar-icons/admin-icon.png" alt="Admin" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const JobIcon = () => <img src="/images/sidebar-icons/job-icon.png" alt="Jobs" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const CompaniesIcon = () => <img src="/images/sidebar-icons/companies-icon.png" alt="Companies" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const UserProfileIcon = () => <img src="/images/sidebar-icons/userprofile-icon.png" alt="User Profiles" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
// const CMSIcon = () => <img src="/images/sidebar-icons/cms-icon.png" alt="CMS" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const FAQIcon = () => <img src="/images/sidebar-icons/faq-icon.png" alt="FAQs" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const TestimonialIcon = () => <img src="/images/sidebar-icons/testimonial-icon.png" alt="Testimonial" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const CVSearchIcon = () => <img src="/images/sidebar-icons/cv -search-icon.png" alt="CV Search" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const CVManagementIcon = () => <img src="/images/sidebar-icons/cv-management.png" alt="CV Status Maintenance" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const LanguageIcon = () => <img src="/images/sidebar-icons/language-icon.png" alt="Languages" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const CountriesIcon = () => <img src="/images/sidebar-icons/countries-icon.png" alt="Countries" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const StatesIcon = () => <img src="/images/sidebar-icons/states-icon.png" alt="States" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const PackageIcon = () => <img src="/images/sidebar-icons/package-icon.png" alt="Packages" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const JobAttributeIcon = () => <img src="/images/sidebar-icons/job-attribute-icon.png" alt="Job Attributes" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const SettingsIcon = () => <img src="/images/sidebar-icons/settings (4) 1.png" alt="Site Settings" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
const ManagePasswordIcon = () => <img src="/images/sidebar-icons/managepassword-icon.png" alt="Manage Password" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <DashboardIcon />,
    name: "Dashboard",
    path: "/",
  },
];

const adminItems: NavItem[] = [
  {
    icon: <AdminIcon />,
    name: "Admin Users",
    path: "/admin-users",
  },
];

const moduleItems: NavItem[] = [
  {
    icon: <JobIcon />,
    name: "Jobs",
    path: "/jobs",
  },
  {
    icon: <CompaniesIcon />,
    name: "Companies",
    path: "/companies",
  },
  {
    icon: <UserProfileIcon />,
    name: "User Profiles",
    path: "/user-profiles",
  },
  // {
  //   icon: <CMSIcon />,
  //   name: "CMS",
  //   path: "/cms",
  // },
  {
    icon: <FAQIcon />,
    name: "FAQs",
    path: "/faqs",
  },
  {
    icon: <TestimonialIcon />,
    name: "Testimonial",
    path: "/testimonial",
  },
  {
    icon: <CVSearchIcon />,
    name: "CV Search",
    path: "/cv-search",
  },
  // {
  //   icon: <CVManagementIcon />,
  //   name: "CV Status Maintenance",
  //   path: "/cv-status-maintenance",
  // },
];

const translationItems: NavItem[] = [
  // {
  //   icon: <LanguageIcon />,
  //   name: "Languages",
  //   path: "/languages",
  // },
];

const locationItems: NavItem[] = [
  {
    icon: <CountriesIcon />,
    name: "Countries",
    path: "/countries",
  },
  {
    icon: <StatesIcon />,
    name: "States",
    path: "/states",
  },
  {
    icon: <CompaniesIcon />, // Using companies icon for cities
    name: "Cities",
    path: "/cities",
  },
];

const packageItems: NavItem[] = [
  // {
  //   icon: <PackageIcon />,
  //   name: "Packages",
  //   path: "/packages",
  // },
];

const attributeItems: NavItem[] = [
  {
    icon: <JobAttributeIcon />,
    name: "Job Attributes",
    path: "/job-attributes",
  },
];

const manageItems: NavItem[] = [
  // {
  //   icon: <SettingsIcon />,
  //   name: "Site Settings",
  //   path: "/site-settings",
  // },
  {
    icon: <ManagePasswordIcon />,
    name: "Manage Password",
    path: "/manage-password",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <div className="w-5 h-5 bg-gray-400 rounded"></div>, // Generic icon for UI Elements
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "admin" | "modules" | "translation" | "location" | "packages" | "attributes" | "manage" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "admin", "modules", "translation", "location", "packages", "attributes", "manage", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : 
                   menuType === "admin" ? adminItems :
                   menuType === "modules" ? moduleItems :
                   menuType === "translation" ? translationItems :
                   menuType === "location" ? locationItems :
                   menuType === "packages" ? packageItems :
                   menuType === "attributes" ? attributeItems :
                   menuType === "manage" ? manageItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "admin" | "modules" | "translation" | "location" | "packages" | "attributes" | "manage" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "admin" | "modules" | "translation" | "location" | "packages" | "attributes" | "manage" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "admin" | "modules" | "translation" | "location" | "packages" | "attributes" | "manage" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-blue-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 flex items-center ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start pl-4"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo/logo.png"
                  alt="Spearwin Logo"
                  width={30}
                  height={30}
                />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-blue-900 tracking-wide">
                    SPEARWIN
                  </span>
                  <span className="text-[9px] text-blue-900 font-medium tracking-wider whitespace-nowrap">
                    EXCELLENCE THROUGH PEOPLE
                  </span>
                </div>
              </div>
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.png"
              alt="Spearwin Logo"
              width={30}
              height={30}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-3">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "ADMIN"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(adminItems, "admin")}
            </div>
            <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "MODULES"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(moduleItems, "modules")}
            </div>
            {/* <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "TRANSLATION"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(translationItems, "translation")}
            </div> */}
            <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "MANAGE LOCATION"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(locationItems, "location")}
            </div>
            {/* <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "USER PACKAGES"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(packageItems, "packages")}
            </div> */}
            <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "JOB ATTRIBUTES"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(attributeItems, "attributes")}
            </div>
            <div className="mt-4">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-blue-900 font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "MANAGE"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(manageItems, "manage")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
