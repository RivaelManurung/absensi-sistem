import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authService } from './auth.service';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AUTH_COOKIE_NAME = 'access_token';
const ROLE_COOKIE_NAME = 'user_role';

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
      const redirectTo =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
          : '/dashboard';

      setCookie(AUTH_COOKIE_NAME, res.data.access_token, { maxAge: 60 * 60 * 12 }); // 12 hours
      setCookie(ROLE_COOKIE_NAME, res.data.user.role, { maxAge: 60 * 60 * 12 });
      toast.success('Login successful');
      queryClient.setQueryData(['auth', 'me'], { data: res.data.user });
      router.replace(redirectTo);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const logout = () => {
    deleteCookie(AUTH_COOKIE_NAME);
    deleteCookie(ROLE_COOKIE_NAME);
    queryClient.clear();
    router.replace('/login');
    toast.success('Logged out successfully');
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
