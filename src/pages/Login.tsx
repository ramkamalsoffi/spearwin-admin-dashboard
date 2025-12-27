import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import AuthLayout from "./AuthPages/AuthPageLayout";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services";
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const googleSuccess = searchParams.get('google_success');
      const token = searchParams.get('token');
      const email = searchParams.get('email');
      const name = searchParams.get('name');
      const picture = searchParams.get('picture');
      const googleId = searchParams.get('googleId');
      const googleToken = searchParams.get('google_token');

      // Check for OAuth errors first
      const oauthError = searchParams.get('error');
      if (oauthError) {
        toast.error(decodeURIComponent(oauthError));
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      if (googleSuccess === 'true') {
        if (token) {
          // Backend provided token - use it directly
          console.log('✅ Google OAuth success - token received');
          localStorage.setItem('accessToken', token);
          localStorage.setItem('user', JSON.stringify({ email, name, picture }));
          
          // Clean URL immediately
          window.history.replaceState({}, '', window.location.pathname);
          
          toast.success("Login successful!");
          navigate("/dashboard");
        } else if (googleToken && email) {
          // No backend token - try to authenticate with backend using Google data
          console.log('🔄 Authenticating with backend using Google data');
          try {
            const success = await loginWithGoogle({
              email,
              name,
              picture,
              googleId,
              accessToken: googleToken,
            });
            
            if (success) {
              console.log('✅ Backend authentication successful');
              window.history.replaceState({}, '', window.location.pathname);
              toast.success("Login successful!");
              navigate("/dashboard");
            } else {
              console.error('❌ No access token in response');
              toast.error('Failed to authenticate with Google. Please try again.');
              window.history.replaceState({}, '', window.location.pathname);
            }
          } catch (error) {
            console.error('❌ Google authentication error:', error);
            toast.error('Failed to authenticate with Google. Please try again.');
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          console.error('❌ Missing required Google OAuth data');
          toast.error('Invalid Google OAuth response. Please try again.');
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    };

    handleGoogleCallback();
  }, [navigate, loginWithGoogle]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password"
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleGoogleLogin = () => {
    adminService.initiateGoogleAuth();
  };

  return (
    <>
      <PageMeta
        title="Login | spearwin-admin"
        description="Login to Spearwin Admin Dashboard"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Login
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to access the dashboard
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input 
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Or</span>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
              </div>

              {/* Google Login */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Sign in with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
