"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from "@/hooks/useRecords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function RecordsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canEdit = user?.role === "ADMIN" || user?.role === "ANALYST";

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [formData, setFormData] = useState({
    amount: "",
    type: "INCOME",
    category: "",
    date: "",
    notes: "",
  });

  const { data: recordsData, isLoading } = useGetRecords(filters);
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        amount: parseFloat(formData.amount),
        type: formData.type as "INCOME" | "EXPENSE",
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
      });
      toast({ title: "Record created successfully" });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create record",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedRecord) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedRecord.id,
        data: {
          amount: parseFloat(formData.amount),
          type: formData.type as "INCOME" | "EXPENSE",
          category: formData.category,
          date: formData.date,
          notes: formData.notes,
        },
      });
      toast({ title: "Record updated successfully" });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update record",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    try {
      await deleteMutation.mutateAsync(selectedRecord.id);
      toast({ title: "Record deleted successfully" });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete record",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const openEditDialog = (record: any) => {
    setSelectedRecord(record);
    setFormData({
      amount: String(record.amount),
      type: record.type,
      category: record.category,
      date: record.date.split("T")[0],
      notes: record.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      type: "INCOME",
      category: "",
      date: "",
      notes: "",
    });
    setSelectedRecord(null);
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      search: "",
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
          <p className="text-gray-500 mt-1">Manage your income and expenses</p>
        </div>
        {canEdit && (
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="finance-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search records..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
            </div>
            <Select
              value={filters.type || "ALL"}
              onValueChange={(value) => setFilters({ ...filters, type: value === "ALL" ? "" : value })}
            >
              <SelectTrigger className="w-[140px] bg-white border-gray-300">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-[160px] bg-white border-gray-300"
            />
            <Button variant="outline" onClick={clearFilters} className="border-gray-300">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="finance-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Notes</th>
                    {canEdit && <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {recordsData?.data?.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-700">{formatDate(record.date)}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{record.category}</td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="outline"
                          className={
                            record.type === "INCOME"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {record.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-right font-medium">
                        <span className={record.type === "INCOME" ? "text-emerald-600" : "text-red-600"}>
                          {record.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(record.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 truncate max-w-xs">
                        {record.notes || "-"}
                      </td>
                      {canEdit && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(record)}
                              className="h-8 w-8 text-gray-400 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(record)}
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {recordsData?.pagination && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {(recordsData.pagination.page - 1) * recordsData.pagination.limit + 1} to{" "}
                {Math.min(
                  recordsData.pagination.page * recordsData.pagination.limit,
                  recordsData.pagination.total
                )}{" "}
                of {recordsData.pagination.total} records
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={recordsData.pagination.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="border-gray-300"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={recordsData.pagination.page >= recordsData.pagination.totalPages}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="border-gray-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Edit Record" : "Add Record"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleUpdate : handleCreate}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditDialogOpen ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 py-4">
            Are you sure you want to delete this record? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
