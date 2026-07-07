import React, { useState } from "react"
import {
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserActivity, Pagination } from "./types"
import { ActivityTableRow } from "./ActivityTableRow"

interface ActivityTableProps {
  items: UserActivity[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  pagination: Pagination;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onClearFilters: () => void;
  searchVal: string;
  roleFilter: string;
  statusFilter: string;
}

export function ActivityTable({
  items,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  pagination,
  setPage,
  onClearFilters,
  searchVal,
  roleFilter,
  statusFilter
}: ActivityTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleExpandRow = (userId: string) => {
    setExpandedRow(expandedRow === userId ? null : userId)
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">
              <th className="p-3 pl-4 w-[240px]">Employee / User</th>
              <th className="p-3 w-[120px]">Role</th>
              <th className="p-3 w-[100px]">Status</th>
              <th className="p-3 w-[130px]">Last Active</th>
              <th className="p-3 min-w-[200px]">Last Location</th>
              {/* <th className="p-3 w-[220px] text-center">Panel Breakdown</th> */}
              <th className="p-3 pr-4 w-[60px] text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-sm">
            {isLoading || isFetching ? (
              // Skeleton Loading Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-neutral-100 dark:border-neutral-850">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div>
                        <div className="h-2.5 bg-neutral-200 dark:bg-neutral-850 rounded w-36"></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-16"></div></td>
                  <td className="p-3"><div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-12"></div></td>
                  <td className="p-3"><div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-16"></div></td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-14"></div>
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-32"></div>
                    </div>
                  </td>
                  {/* <td className="p-3">
                    <div className="flex justify-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="size-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                      ))}
                    </div>
                  </td> */}
                  <td className="p-3 pr-4 text-right">
                    <div className="size-6 bg-neutral-200 dark:bg-neutral-800 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              // Error State
              <tr>
                <td colSpan={6} className="p-8 text-center text-rose-500 dark:text-rose-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="size-8 text-rose-500" />
                    <p className="font-semibold">{error?.message || "Failed to fetch logs"}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refetch}
                      className="mt-2 text-xs"
                    >
                      Try Again
                    </Button>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Users className="size-8 text-neutral-300 dark:text-neutral-700" />
                    <p className="font-semibold">No activity logs found</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      Try adjusting your search query or filter tags.
                    </p>
                    {(searchVal || roleFilter || statusFilter) && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={onClearFilters}
                        className="mt-1"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Render items
              items.map((userItem) => (
                <ActivityTableRow
                  key={userItem.userId}
                  userItem={userItem}
                  isExpanded={expandedRow === userItem.userId}
                  onToggleExpand={() => toggleExpandRow(userItem.userId)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 text-sm gap-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
            </span> to <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {pagination.total}
            </span> employees
          </div>

          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              onClick={() => setPage(1)}
              disabled={pagination.page <= 1 || isLoading}
              className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="size-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={pagination.page <= 1 || isLoading}
              className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 font-mono text-xs px-2">
              <span className="text-neutral-400 dark:text-neutral-500">Page</span>
              <span className="font-bold text-neutral-950 dark:text-neutral-50">{pagination.page}</span>
              <span className="text-neutral-400 dark:text-neutral-500">of</span>
              <span className="font-bold text-neutral-955 dark:text-neutral-50">
                {totalPages}
              </span>
            </div>

            {/* Next Page */}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={pagination.page >= totalPages || isLoading}
              className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={pagination.page >= totalPages || isLoading}
              className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
