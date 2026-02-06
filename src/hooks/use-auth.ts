import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, type LoginCredentials, type RegisterCredentials, type AuthResponse } from '@/api';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS, CACHE_TIME } from '@/config/constants';

/**
 * Hook to get current user profile
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.user.profile(),
    queryFn: () => import('@/api').then((m) => m.userApi.getProfile()),
    enabled: isAuthenticated,
    staleTime: CACHE_TIME.MEDIUM,
  });
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      // Store access token for API client
      localStorage.setItem('accessToken', data.tokens.accessToken);
      toast.success('Login successful!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.all });
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: (credentials) => authApi.register(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      localStorage.setItem('accessToken', data.tokens.accessToken);
      toast.success('Registration successful!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.all });
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem('accessToken');
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Still clear auth on error
      clearAuth();
      localStorage.removeItem('accessToken');
      queryClient.clear();
    },
  });
}
