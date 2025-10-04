import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AdminUsers from "./pages/AdminUsers";
import AddAdminUsers from "./pages/AddAdminUsers";
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import UserProfilesManagement from "./pages/UserProfilesManagement";
import AddProfile from "./pages/AddProfile";
import FAQs from "./pages/FAQs";
import AddFAQ from "./pages/AddFAQ";
import Testimonials from "./pages/Testimonials";
import AddTestimonial from "./pages/AddTestimonial";
import CVSearch from "./pages/CVSearch";
import CVStatusMaintenance from "./pages/CVStatusMaintenance";
import AddCVStatus from "./pages/AddCVStatus";
import Languages from "./pages/Languages";
import AddLanguage from "./pages/AddLanguage";
import Countries from "./pages/Countries";
import AddCountry from "./pages/AddCountry";
import States from "./pages/States";
import AddStates from "./pages/AddStates";
import Cities from "./pages/Cities";
import AddCities from "./pages/AddCities";
import Packages from "./pages/Packages";
import AddPackage from "./pages/AddPackage";
import JobAttributes from "./pages/JobAttributes";
import ManagePassword from "./pages/ManagePassword";
import SiteSettings from "./pages/SiteSettings";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Admin Pages */}
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/add-admin-users" element={<AddAdminUsers />} />

            {/* Jobs Pages */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/add-job" element={<AddJob />} />

            {/* Companies Pages */}
            <Route path="/companies" element={<Companies />} />
            <Route path="/add-company" element={<AddCompany />} />

            {/* User Profiles Pages */}
            <Route path="/user-profiles" element={<UserProfilesManagement />} />
            <Route path="/add-profile" element={<AddProfile />} />

            {/* FAQs Pages */}
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/add-faq" element={<AddFAQ />} />

            {/* Testimonials Pages */}
            <Route path="/testimonial" element={<Testimonials />} />
            <Route path="/add-testimonial" element={<AddTestimonial />} />

            {/* CV Search Pages */}
            <Route path="/cv-search" element={<CVSearch />} />

            {/* CV Status Maintenance Pages */}
            <Route path="/cv-status-maintenance" element={<CVStatusMaintenance />} />
            <Route path="/add-cv-status" element={<AddCVStatus />} />

            {/* Languages Pages */}
            <Route path="/languages" element={<Languages />} />
            <Route path="/add-language" element={<AddLanguage />} />

            {/* Countries Pages */}
            <Route path="/countries" element={<Countries />} />
            <Route path="/add-country" element={<AddCountry />} />

            {/* Cities Pages */}
            <Route path="/cities" element={<Cities />} />
            <Route path="/add-cities" element={<AddCities />} />

            {/* States Pages */}
            <Route path="/states" element={<States />} />
            <Route path="/add-states" element={<AddStates />} />

            {/* Packages Pages */}
            <Route path="/packages" element={<Packages />} />
            <Route path="/add-package" element={<AddPackage />} />

            {/* Job Attributes Pages */}
            <Route path="/job-attributes" element={<JobAttributes />} />

            {/* Manage Pages */}
            <Route path="/manage-password" element={<ManagePassword />} />
            <Route path="/site-settings" element={<SiteSettings />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
