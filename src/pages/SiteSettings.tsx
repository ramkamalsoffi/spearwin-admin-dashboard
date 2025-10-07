import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

// Dropdown Input Component
const DropdownInput = ({ 
  placeholder, 
  value, 
  onChange, 
  options 
}: { 
  placeholder: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default function SiteSettings() {
  const [activeTab, setActiveTab] = useState("Email");
  const [formData, setFormData] = useState({
    mailDriver: "SMTP",
    mailHost: "",
    mailPort: "",
    mailEncryption: "",
    mailUsername: "",
    mailPassword: "",
    mailSendmail: "",
    mailPretend: "false",
    mailgunDomain: "",
    mailgunSecret: "",
    mandrillSecret: "",
    instagramLink: "",
    facebookLink: "",
    youtubeLink: "",
    linkedinLink: "",
    indexPageBelowTopEmployes: "",
    cmsPageBelowContentAd: "",
    indexPageBelowCities: "",
    listingPageSidebarVerticalAd: "",
    dashboardBelowMenuVerticalAd: "",
    listingPageBelowListingsHorizontalAd: "",
    captchaSitekey: "",
    captchaSecret: "",
    captchaDashboardAd: "",
    facebookId: "",
    facebookSecret: "",
    twitterId: "",
    twitterSecret: "",
    paypalAccount: "",
    paypalClientId: "",
    paypalSecret: "",
    paypalSandbox: "",
    paypalActive: "",
    payuMode: "",
    payuKey: "",
    payuSalt: "",
    payuActive: "",
    stripePublicationKey: "",
    stripeSecret: "",
    stripeActive: "",
    mailchimpApiKey: "",
    mailchimpListName: "",
    mailchimpListId: "",
    analyticsCode: "",
    googleTagManagerHead: "",
    googleTagManagerBody: "",
    jobg8Username: "",
    jobg8Password: "",
    jobg8ImportJobs: "spearwin.com"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Site Settings form submitted:", formData);
    // Handle form submission logic here
    alert("Settings updated successfully!");
  };

  const tabs = [
    "Site",
    "Email",
    "Social Network", 
    "Manage Ads",
    "Captcha",
    "Social Media Login",
    "Payment Gateways",
    "Mail Chimp",
    "Google Analytics",
    "jobg8 API"
  ];

  const mailDriverOptions = [
    { value: "SMTP", label: "SMTP" },
    { value: "Sendmail", label: "Sendmail" },
    { value: "Mailgun", label: "Mailgun" },
    { value: "Mandrill", label: "Mandrill" }
  ];

  return (
    <>
      <PageMeta
        title="Site Settings | spearwin-admin"
        description="Manage Site Settings"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Site Settings" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="bg-white px-6 py-4">
            <nav className="flex overflow-x-auto scrollbar-hide">
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium text-sm transition-all duration-200 whitespace-nowrap border-r border-gray-200 last:border-r-0 ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-800"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-4">
            {activeTab === "Email" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Mail Driver */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mail Driver
                  </label>
                  <DropdownInput
                    placeholder="Select Mail Driver"
                    value={formData.mailDriver}
                    onChange={(value) => handleInputChange("mailDriver", value)}
                    options={mailDriverOptions}
                  />
                </div>

                {/* SMTP Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Host
                      </label>
                      <input
                        type="text"
                        value={formData.mailHost}
                        onChange={(e) => handleInputChange("mailHost", e.target.value)}
                        placeholder="Enter host"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Port
                      </label>
                      <input
                        type="text"
                        value={formData.mailPort}
                        onChange={(e) => handleInputChange("mailPort", e.target.value)}
                        placeholder="Enter port number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Encryption
                      </label>
                      <input
                        type="text"
                        value={formData.mailEncryption}
                        onChange={(e) => handleInputChange("mailEncryption", e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Username
                      </label>
                      <input
                        type="text"
                        value={formData.mailUsername}
                        onChange={(e) => handleInputChange("mailUsername", e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Password
                      </label>
                      <input
                        type="password"
                        value={formData.mailPassword}
                        onChange={(e) => handleInputChange("mailPassword", e.target.value)}
                        placeholder="Enter email name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Mail Pretend Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Mail Pretend Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Sendmail
                      </label>
                      <input
                        type="text"
                        value={formData.mailSendmail}
                        onChange={(e) => handleInputChange("mailSendmail", e.target.value)}
                        placeholder="Sendmail"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail Pretend
                      </label>
                      <input
                        type="text"
                        value={formData.mailPretend}
                        onChange={(e) => handleInputChange("mailPretend", e.target.value)}
                        placeholder="false"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mail Gun Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mail Gun Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mailgun Domain
                      </label>
                      <input
                        type="text"
                        value={formData.mailgunDomain}
                        onChange={(e) => handleInputChange("mailgunDomain", e.target.value)}
                        placeholder="Enter domain"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mailgun Secret
                      </label>
                      <input
                        type="text"
                        value={formData.mailgunSecret}
                        onChange={(e) => handleInputChange("mailgunSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mandrill Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mandrill Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mandrill Secret
                      </label>
                      <input
                        type="text"
                        value={formData.mandrillSecret}
                        onChange={(e) => handleInputChange("mandrillSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Spartpost Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spartpost Settings</h3>
                  {/* No fields visible in the image */}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            )}

            {/* Social Network Tab Content */}
            {activeTab === "Social Network" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.instagramLink}
                      onChange={(e) => handleInputChange("instagramLink", e.target.value)}
                      placeholder="Enter link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.facebookLink}
                      onChange={(e) => handleInputChange("facebookLink", e.target.value)}
                      placeholder="Enter link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Youtube */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Youtube
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeLink}
                      onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                      placeholder="Enter link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Linkedin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Linkedin
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinLink}
                      onChange={(e) => handleInputChange("linkedinLink", e.target.value)}
                      placeholder="Enter link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Manage Ads Tab Content */}
            {activeTab === "Manage Ads" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Index Page Below top Employes
                      </label>
                      <input
                        type="url"
                        value={formData.indexPageBelowTopEmployes}
                        onChange={(e) => handleInputChange("indexPageBelowTopEmployes", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CMS Page Below Content Ad
                      </label>
                      <input
                        type="url"
                        value={formData.cmsPageBelowContentAd}
                        onChange={(e) => handleInputChange("cmsPageBelowContentAd", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Index Page Below Cities
                      </label>
                      <input
                        type="url"
                        value={formData.indexPageBelowCities}
                        onChange={(e) => handleInputChange("indexPageBelowCities", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Page Sidebar Verticle Ad
                      </label>
                      <input
                        type="url"
                        value={formData.listingPageSidebarVerticalAd}
                        onChange={(e) => handleInputChange("listingPageSidebarVerticalAd", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dashboard Below Menu Verticle Ad
                      </label>
                      <input
                        type="url"
                        value={formData.dashboardBelowMenuVerticalAd}
                        onChange={(e) => handleInputChange("dashboardBelowMenuVerticalAd", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Page Below Listings Horizantal Ad
                      </label>
                      <input
                        type="url"
                        value={formData.listingPageBelowListingsHorizontalAd}
                        onChange={(e) => handleInputChange("listingPageBelowListingsHorizontalAd", e.target.value)}
                        placeholder="Enter link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Captcha Tab Content */}
            {activeTab === "Captcha" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitekey
                    </label>
                    <input
                      type="text"
                      value={formData.captchaSitekey}
                      onChange={(e) => handleInputChange("captchaSitekey", e.target.value)}
                      placeholder="Sitekey"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret
                    </label>
                    <input
                      type="text"
                      value={formData.captchaSecret}
                      onChange={(e) => handleInputChange("captchaSecret", e.target.value)}
                      placeholder="Secret"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dashboard Below Menu Verticle Ad
                    </label>
                    <input
                      type="url"
                      value={formData.captchaDashboardAd}
                      onChange={(e) => handleInputChange("captchaDashboardAd", e.target.value)}
                      placeholder="Enter link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Social Media Login Tab Content */}
            {activeTab === "Social Media Login" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Facebook Section */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook ID
                      </label>
                      <input
                        type="text"
                        value={formData.facebookId}
                        onChange={(e) => handleInputChange("facebookId", e.target.value)}
                        placeholder="Enter ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret
                      </label>
                      <input
                        type="text"
                        value={formData.facebookSecret}
                        onChange={(e) => handleInputChange("facebookSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Twitter Section */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter ID
                      </label>
                      <input
                        type="text"
                        value={formData.twitterId}
                        onChange={(e) => handleInputChange("twitterId", e.target.value)}
                        placeholder="Enter ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret
                      </label>
                      <input
                        type="text"
                        value={formData.twitterSecret}
                        onChange={(e) => handleInputChange("twitterSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Payment Gateways Tab Content */}
            {activeTab === "Payment Gateways" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* PayPal Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PayPal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paypal Account
                      </label>
                      <input
                        type="text"
                        value={formData.paypalAccount}
                        onChange={(e) => handleInputChange("paypalAccount", e.target.value)}
                        placeholder="Enter Account"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paypal Client ID
                      </label>
                      <input
                        type="text"
                        value={formData.paypalClientId}
                        onChange={(e) => handleInputChange("paypalClientId", e.target.value)}
                        placeholder="Enter client id"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paypal Secret
                      </label>
                      <input
                        type="text"
                        value={formData.paypalSecret}
                        onChange={(e) => handleInputChange("paypalSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is Sandbox?
                      </label>
                      <DropdownInput
                        placeholder="Select"
                        value={formData.paypalSandbox}
                        onChange={(value) => handleInputChange("paypalSandbox", value)}
                        options={[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is Paypal Active?
                      </label>
                      <DropdownInput
                        placeholder="Select"
                        value={formData.paypalActive}
                        onChange={(value) => handleInputChange("paypalActive", value)}
                        options={[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* PayU Money Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PayU Money</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayU Mode
                      </label>
                      <DropdownInput
                        placeholder="Select mode"
                        value={formData.payuMode}
                        onChange={(value) => handleInputChange("payuMode", value)}
                        options={[
                          { value: "sandbox", label: "Sandbox" },
                          { value: "live", label: "Live" }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayU Key
                      </label>
                      <input
                        type="text"
                        value={formData.payuKey}
                        onChange={(e) => handleInputChange("payuKey", e.target.value)}
                        placeholder="Enter key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayU Salt
                      </label>
                      <input
                        type="text"
                        value={formData.payuSalt}
                        onChange={(e) => handleInputChange("payuSalt", e.target.value)}
                        placeholder="Enter salt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is PayU Active?
                      </label>
                      <DropdownInput
                        placeholder="Select"
                        value={formData.payuActive}
                        onChange={(value) => handleInputChange("payuActive", value)}
                        options={[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Stripe Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Stripe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Publication Key
                      </label>
                      <input
                        type="text"
                        value={formData.stripePublicationKey}
                        onChange={(e) => handleInputChange("stripePublicationKey", e.target.value)}
                        placeholder="Enter key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stipr Secret
                      </label>
                      <input
                        type="text"
                        value={formData.stripeSecret}
                        onChange={(e) => handleInputChange("stripeSecret", e.target.value)}
                        placeholder="Enter secret"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is Stripr is Active
                      </label>
                      <DropdownInput
                        placeholder="Select"
                        value={formData.stripeActive}
                        onChange={(value) => handleInputChange("stripeActive", value)}
                        options={[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Mail Chimp Tab Content */}
            {activeTab === "Mail Chimp" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mail Chimp API Key
                    </label>
                    <input
                      type="text"
                      value={formData.mailchimpApiKey}
                      onChange={(e) => handleInputChange("mailchimpApiKey", e.target.value)}
                      placeholder="Enter key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mail Chimp List Name
                    </label>
                    <input
                      type="text"
                      value={formData.mailchimpListName}
                      onChange={(e) => handleInputChange("mailchimpListName", e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mail Chimp List ID
                    </label>
                    <input
                      type="text"
                      value={formData.mailchimpListId}
                      onChange={(e) => handleInputChange("mailchimpListId", e.target.value)}
                      placeholder="Enter ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Google Analytics Tab Content */}
            {activeTab === "Google Analytics" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Analytics Code
                    </label>
                    <input
                      type="text"
                      value={formData.analyticsCode}
                      onChange={(e) => handleInputChange("analyticsCode", e.target.value)}
                      placeholder="Enter analytics code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Tag Manager for Head
                    </label>
                    <input
                      type="text"
                      value={formData.googleTagManagerHead}
                      onChange={(e) => handleInputChange("googleTagManagerHead", e.target.value)}
                      placeholder="Enter Tag"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Tag Manager for Body
                    </label>
                    <input
                      type="text"
                      value={formData.googleTagManagerBody}
                      onChange={(e) => handleInputChange("googleTagManagerBody", e.target.value)}
                      placeholder="Enter Tag"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Jobg8 API Tab Content */}
            {activeTab === "jobg8 API" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.jobg8Username}
                      onChange={(e) => handleInputChange("jobg8Username", e.target.value)}
                      placeholder="Enter username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.jobg8Password}
                      onChange={(e) => handleInputChange("jobg8Password", e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Import jobs from Jobg8 API here
                    </label>
                    <input
                      type="text"
                      value={formData.jobg8ImportJobs}
                      onChange={(e) => handleInputChange("jobg8ImportJobs", e.target.value)}
                      placeholder="Enter domain"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Other tabs content can be added here */}
            {activeTab !== "Email" && activeTab !== "Social Network" && activeTab !== "Manage Ads" && activeTab !== "Captcha" && activeTab !== "Social Media Login" && activeTab !== "Payment Gateways" && activeTab !== "Mail Chimp" && activeTab !== "Google Analytics" && activeTab !== "jobg8 API" && (
              <div className="text-center py-8">
                <p className="text-gray-500">Settings for {activeTab} will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
