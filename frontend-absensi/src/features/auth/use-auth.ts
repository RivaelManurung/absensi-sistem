import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authService } from './auth.service';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toastHelper } from '@/lib/toast';

const AUTH_COOKIE_NAME = 'access_token';
const REFRESH_COOKIE_NAME = 'refresh_token';
const ROLE_COOKIE_NAME = 'user_role';

function getDefaultRedirect(role?: string) {
  return role === 'admin' || role === 'hr' ? '/admin/dashboard' : '/app/attendance';
}

function getSafeRedirectUrl(redirect: string | null, role?: string) {
  if (!redirect || redirect.startsWith('http') || redirect.startsWith('//')) {
    return getDefaultRedirect(role);
  }

  if (redirect.startsWith('/admin') && role !== 'admin' && role !== 'hr') {
    return '/app/attendance';
  }

  if (redirect.startsWith('/admin') || redirect.startsWith('/app')) {
    return redirect;
  }

  return getDefaultRedirect(role);
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getCookie(AUTH_COOKIE_NAME);

  const { data, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      const redirectParam =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect')
          : null;
      const redirectTo = getSafeRedirectUrl(redirectParam, res.data.user.role);

      setCookie(AUTH_COOKIE_NAME, res.data.access_token, { maxAge: 60 * 60 * 12 }); // 12 hours
      setCookie(REFRESH_COOKIE_NAME, res.data.refresh_token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie(ROLE_COOKIE_NAME, res.data.user.role, { maxAge: 60 * 60 * 12 });
      toastHelper.success('Login successful', `Welcome back, ${res.data.user.name}!`);
      if (process.env.NODE_ENV === "development") {
        console.log("AUTH USER PERMISSIONS:", res.data.permissions);
      }
      queryClient.setQueryData(['auth', 'me'], { 
        data: { 
          ...res.data.user, 
          permissions: res.data.permissions 
        } 
      });
      router.replace(redirectTo);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error('Login failed', error.response?.data?.message || 'Invalid email or password.');
    },
  });

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // Client-side logout must still complete even if the session is already expired.
    }
    deleteCookie(AUTH_COOKIE_NAME);
    deleteCookie(REFRESH_COOKIE_NAME);
    deleteCookie(ROLE_COOKIE_NAME);
    queryClient.clear();
    router.replace('/login');
    toastHelper.success('Logged out', 'You have been signed out successfully.');
  };

  return {
    user: data?.data,
    isCheckingAuth: Boolean(token) && isCheckingAuth,
    isAuthenticated: Boolean(token) && !!data?.data,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};
