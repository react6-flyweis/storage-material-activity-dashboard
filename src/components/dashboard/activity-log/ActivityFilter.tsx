import { Search, Filter as FilterIcon, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActivityFilterProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  limit: number;
  setLimit: (val: number) => void;
  onClearFilters: () => void;
}

export function ActivityFilter({
  searchVal,
  setSearchVal,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  limit,
  setLimit,
  onClearFilters
}: ActivityFilterProps) {
  return (
    <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <FilterIcon className="size-4 text-neutral-400" />
        <h2 className="text-sm font-semibold tracking-tight">Filter Logs</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder-neutral-400 dark:placeholder-neutral-500"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 size-4.5 rounded-full flex items-center justify-center transition-colors"
            >
              &times;
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
            <option value="construction">Construction</option>
            <option value="plant">Plant</option>
            <option value="account">Account</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        {/* Limit Selector */}
        <div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full py-1.5 px-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full text-xs font-semibold py-1.5 h-auto flex items-center justify-center gap-1 text-neutral-500 hover:text-neutral-900 border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <RotateCcw className="size-3.5" />
            Reset filters
          </Button>
        </div>
      </div>
    </section>
  )
}
