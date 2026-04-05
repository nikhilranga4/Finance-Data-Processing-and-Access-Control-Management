export interface User {
  id: string;
  email: string;
  name: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  notes: string | null;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
  lastUpdated: string | null;
}

export interface CategoryTotal {
  category: string;
  type: "INCOME" | "EXPENSE";
  total: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface WeeklyTrend {
  week: string;
  income: number;
  expenses: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
