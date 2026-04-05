import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/types";

interface Filters {
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}

const USERS_KEY = "users";

export function useGetUsers(filters: Filters = {}) {
  return useQuery({
    queryKey: [USERS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      const { data } = await api.get<PaginatedResponse<User>>(
        `/users?${params.toString()}`
      );
      return data;
    },
  });
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: { user: User } }>(`/users/${id}`);
      return data.data.user;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const { data } = await api.post("/users", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: userData,
    }: {
      id: string;
      data: Partial<User>;
    }) => {
      const { data } = await api.patch(`/users/${id}`, userData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}
