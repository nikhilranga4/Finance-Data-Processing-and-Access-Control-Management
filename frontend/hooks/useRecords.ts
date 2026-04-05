import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { FinancialRecord, PaginatedResponse } from "@/types";

interface Filters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const RECORDS_KEY = "records";

export function useGetRecords(filters: Filters = {}) {
  return useQuery({
    queryKey: [RECORDS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      const { data } = await api.get<PaginatedResponse<FinancialRecord>>(
        `/records?${params.toString()}`
      );
      return data;
    },
  });
}

export function useGetRecord(id: string) {
  return useQuery({
    queryKey: [RECORDS_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: { record: FinancialRecord } }>(
        `/records/${id}`
      );
      return data.data.record;
    },
    enabled: !!id,
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordData: {
      amount: number;
      type: "INCOME" | "EXPENSE";
      category: string;
      date: string;
      notes?: string;
    }) => {
      const { data } = await api.post("/records", recordData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: recordData,
    }: {
      id: string;
      data: Partial<FinancialRecord>;
    }) => {
      const { data } = await api.patch(`/records/${id}`, recordData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/records/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
