"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSummary,
  useCategoryTotals,
  useMonthlyTrend,
  useRecentActivity,
} from "@/hooks/useDashboard";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: categoryTotals, isLoading: categoriesLoading } = useCategoryTotals();
  const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend(6);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(10);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    loading,
    color,
  }: {
    title: string;
    value: string;
    icon: any;
    trend?: string;
    trendUp?: boolean;
    loading: boolean;
    color: string;
  }) => (
    <Card className="finance-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="h-7 w-24 mt-1 bg-gray-200" />
            ) : (
              <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
            )}
            {trend && !loading && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
                {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your financial data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.totalIncome || 0)}
          icon={TrendingUp}
          loading={summaryLoading}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.totalExpenses || 0)}
          icon={TrendingDown}
          loading={summaryLoading}
          color="bg-red-100 text-red-700"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary?.netBalance || 0)}
          icon={Wallet}
          trend={`${(((summary?.netBalance || 0) / (summary?.totalIncome || 1)) * 100).toFixed(1)}% of income`}
          trendUp={(summary?.netBalance || 0) > 0}
          loading={summaryLoading}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Total Records"
          value={String(summary?.totalRecords || 0)}
          icon={FileText}
          loading={summaryLoading}
          color="bg-gray-100 text-gray-700"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Monthly Trend */}
        <Card className="finance-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-sm">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {trendLoading ? (
              <Skeleton className="h-64 w-full bg-gray-200" />
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart data={monthlyTrend || []}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#6b7280" }}
                    itemStyle={{ color: "#111827" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="finance-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {categoriesLoading ? (
              <Skeleton className="h-64 w-full bg-gray-200" />
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={(categoryTotals || []).slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="total"
                  >
                    {(categoryTotals || []).slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value),
                      props.payload.category,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="finance-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-900 text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {activityLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Category</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Amount</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentActivity || []).map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-xs text-gray-700">{formatDate(record.date)}</td>
                      <td className="py-2 px-3 text-xs text-gray-700">{record.category}</td>
                      <td className="py-2 px-3">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: record.type === "INCOME" ? "#d1fae5" : "#fee2e2",
                            color: record.type === "INCOME" ? "#047857" : "#dc2626",
                            borderColor: record.type === "INCOME" ? "#a7f3d0" : "#fecaca"
                          }}
                        >
                          {record.type}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-xs text-right font-medium">
                        <span className={record.type === "INCOME" ? "text-emerald-600" : "text-red-600"}>
                          {record.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(record.amount)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500 truncate max-w-[150px]">
                        {record.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
