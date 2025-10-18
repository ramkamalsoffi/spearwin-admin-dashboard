import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../../services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      console.warn('User not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  if (!authService.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
