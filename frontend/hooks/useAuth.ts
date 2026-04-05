import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AuthResponse, User } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, token, setAuth, logout, isLoading, setLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>("/auth/login", credentials);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const { data } = await api.post<AuthResponse>("/auth/register", userData);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });

  const initialize = async () => {
    if (typeof window === "undefined") return;
    
    const storedToken = localStorage.getItem("finance_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      if (data.data?.user) {
        setAuth(data.data.user, storedToken);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    initialize,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
