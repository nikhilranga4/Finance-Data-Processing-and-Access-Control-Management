import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardSummary, CategoryTotal, MonthlyTrend, WeeklyTrend, FinancialRecord } from "@/types";

const DASHBOARD_KEY = "dashboard";

export function useSummary() {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "summary"],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardSummary }>(
        "/dashboard/summary"
      );
      return data.data;
    },
  });
}

export function useCategoryTotals() {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "category-totals"],
    queryFn: async () => {
      const { data } = await api.get<{ data: CategoryTotal[] }>(
        "/dashboard/category-totals"
      );
      return data.data;
    },
  });
}

export function useMonthlyTrend(months: number = 6) {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "monthly-trend", months],
    queryFn: async () => {
      const { data } = await api.get<{ data: MonthlyTrend[] }>(
        `/dashboard/monthly-trend?months=${months}`
      );
      return data.data;
    },
  });
}

export function useWeeklyTrend(weeks: number = 8) {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "weekly-trend", weeks],
    queryFn: async () => {
      const { data } = await api.get<{ data: WeeklyTrend[] }>(
        `/dashboard/weekly-trend?weeks=${weeks}`
      );
      return data.data;
    },
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "recent-activity", limit],
    queryFn: async () => {
      const { data } = await api.get<{ data: FinancialRecord[] }>(
        `/dashboard/recent-activity?limit=${limit}`
      );
      return data.data;
    },
  });
}
