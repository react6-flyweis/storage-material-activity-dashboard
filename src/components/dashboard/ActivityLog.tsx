import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  AlertCircle,
  Clock,
  Shield,
  TrendingUp,
  Hammer,
  Factory,
  Wallet,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

// Interface definitions matching the backend API response
interface LastPage {
  panel: string;
  page: string;
  visitedAt: string;
}

interface PanelActivity {
  lastVisitedAt: string;
  lastPage: string;
}

interface Panels {
  admin: PanelActivity | null;
  sales: PanelActivity | null;
  construction: PanelActivity | null;
  plant: PanelActivity | null;
  account: PanelActivity | null;
}

interface UserActivity {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'construction' | 'plant' | 'account' | 'customer';
  panel: string;
  lastActiveAt: string | null;
  lastPage: LastPage | null;
  panels: Panels;
  isActive?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface ApiResponse {
  items: UserActivity[];
  pagination: Pagination;
}

// Helpers for role styling
const ROLE_CONFIG = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30", icon: Shield },
  sales: { label: "Sales", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30", icon: TrendingUp },
  construction: { label: "Construction", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30", icon: Hammer },
  plant: { label: "Plant", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30", icon: Factory },
  account: { label: "Account", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30", icon: Wallet },
  customer: { label: "Customer", color: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30", icon: User }
};

const PANEL_LABELS: Record<keyof Panels, string> = {
  admin: "Admin",
  sales: "Sales",
  construction: "Construction",
  plant: "Plant",
  account: "Account"
};

export function ActivityLog() {
  // Filter states
  const [searchVal, setSearchVal] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  // UI interaction states
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal)
      setPage(1) // Reset page on search change
    }, 350)
    return () => clearTimeout(handler)
  }, [searchVal])

  // Fetch page activity from the API using React Query
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<ApiResponse>({
    queryKey: ["activityLogs", { roleFilter, statusFilter, debouncedSearch, page, limit }],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit
      }
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.isActive = statusFilter
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()

      const response = await api.get("/api/admin/activity/page-visits", { params })
      return response.data.data
    }
  })

  // Reset all filters to defaults
  const handleClearFilters = () => {
    setSearchVal("")
    setDebouncedSearch("")
    setRoleFilter("")
    setStatusFilter("")
    setPage(1)
    setLimit(10)
  }

  // Format relative time helper
  const formatRelativeTime = (dateString: string | null): string => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 10) return "Just now"
    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Format full date for tooltips
  const formatFullDate = (dateString: string | null): string => {
    if (!dateString) return "No activity history"
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    })
  }

  // Mask sensitive email slightly
  const maskEmail = (email: string): string => {
    const [name, domain] = email.split("@")
    if (!name || !domain) return email
    if (name.length <= 2) return `*@${domain}`
    return `${name[0]}***${name[name.length - 1]}@${domain}`
  }

  // Extract items and pagination data
  const items = data?.items || []
  const pagination = data?.pagination || { page: 1, limit: limit, total: 0 }



  const toggleExpandRow = (userId: string) => {
    setExpandedRow(expandedRow === userId ? null : userId)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Control Board */}
      <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Filter className="size-4 text-neutral-400" />
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
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
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
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
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
              onClick={handleClearFilters}
              className="w-full text-xs font-semibold py-1.5 h-auto flex items-center justify-center gap-1 text-neutral-500 hover:text-neutral-900 border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              <RotateCcw className="size-3.5" />
              Reset filters
            </Button>
          </div>
        </div>
      </section>

      {/* Database Content Table */}
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
                <th className="p-3 w-[220px] text-center">Panel Breakdown</th>
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
                    <td className="p-3">
                      <div className="flex justify-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="size-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="size-6 bg-neutral-200 dark:bg-neutral-800 rounded-lg ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                // Error State
                <tr>
                  <td colSpan={7} className="p-8 text-center text-rose-500 dark:text-rose-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="size-8 text-rose-500" />
                      <p className="font-semibold">{error instanceof Error ? error.message : "Failed to fetch logs"}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
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
                  <td colSpan={7} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
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
                          onClick={handleClearFilters}
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
                items.map((userItem) => {
                  const roleInfo = ROLE_CONFIG[userItem.role] || { label: userItem.role, color: "bg-neutral-100 text-neutral-850", icon: User };
                  const RoleIcon = roleInfo.icon;
                  const isExpanded = expandedRow === userItem.userId;
                  const nameInitials = userItem.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                  const userPanels = (Object.keys(PANEL_LABELS) as Array<keyof Panels>).filter((panelKey) => {
                    if (userItem.role === "admin") return true;
                    return panelKey === userItem.role;
                  });
                  const activePanels = userPanels.filter(
                    (panelKey) => !!userItem.panels[panelKey]
                  );

                  return (
                    <React.Fragment key={userItem.userId}>
                      {/* Table Row */}
                      <tr
                        onClick={() => toggleExpandRow(userItem.userId)}
                        className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 cursor-pointer border-b border-neutral-100 dark:border-neutral-850 transition-colors ${isExpanded ? "bg-neutral-50/40 dark:bg-neutral-900/10" : ""
                          }`}
                      >
                        {/* User details */}
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 shrink-0 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center font-bold text-xs border border-neutral-200 dark:border-neutral-700 select-none">
                              {nameInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-neutral-900 dark:text-neutral-50 truncate hover:text-primary transition-colors">
                                {userItem.name}
                              </p>
                              <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate" title={userItem.email}>
                                {maskEmail(userItem.email)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${roleInfo.color}`}>
                            <RoleIcon className="size-3" />
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs ${userItem.isActive !== false
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-neutral-400 dark:text-neutral-500"
                            }`}>
                            <span className={`size-1.5 rounded-full ${userItem.isActive !== false ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"
                              }`} />
                            {userItem.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Last Active relative */}
                        <td className="p-3 text-neutral-600 dark:text-neutral-400 font-mono text-xs" title={formatFullDate(userItem.lastActiveAt)}>
                          {formatRelativeTime(userItem.lastActiveAt)}
                        </td>

                        {/* Global Last Page */}
                        <td className="p-3 max-w-[240px]">
                          {userItem.lastPage ? (
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                {userItem.lastPage.panel}
                              </div>
                              <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate" title={userItem.lastPage.page}>
                                {userItem.lastPage.page}
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-300 dark:text-neutral-700 font-mono">-</span>
                          )}
                        </td>

                        {/* Panel breakdown indicators */}
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {userPanels.map((panelKey) => {
                              const panelActivity = userItem.panels[panelKey];
                              const hasActivity = !!panelActivity;

                              // Color classes per panel style when active
                              let activeBadgeStyle = "";
                              switch (panelKey) {
                                case "admin": activeBadgeStyle = "bg-purple-500/20 text-purple-600 border-purple-500/30 dark:bg-purple-500/30 dark:text-purple-400"; break;
                                case "sales": activeBadgeStyle = "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/30 dark:text-emerald-400"; break;
                                case "construction": activeBadgeStyle = "bg-amber-500/20 text-amber-600 border-amber-500/30 dark:bg-amber-500/30 dark:text-amber-400"; break;
                                case "plant": activeBadgeStyle = "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/30 dark:text-indigo-400"; break;
                                case "account": activeBadgeStyle = "bg-rose-500/20 text-rose-600 border-rose-500/30 dark:bg-rose-500/30 dark:text-rose-400"; break;
                              }

                              const shortLabel = panelKey.slice(0, 2).toUpperCase();

                              return (
                                <div key={panelKey} className="group relative flex items-center justify-center">
                                  <span
                                    className={`size-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${hasActivity
                                      ? `${activeBadgeStyle} cursor-help`
                                      : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200/40 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 opacity-40 select-none"
                                      }`}
                                  >
                                    {shortLabel}
                                  </span>

                                  {/* CSS Tooltip on Hover */}
                                  <div className="pointer-events-none absolute bottom-full mb-2 z-30 hidden w-52 rounded-lg bg-neutral-900 p-2.5 text-xs text-neutral-100 shadow-xl group-hover:block dark:bg-neutral-800 border border-neutral-700/50 dark:border-neutral-700/60 leading-normal">
                                    <div className="font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between pb-1 border-b border-neutral-800/80 dark:border-neutral-700/60">
                                      <span className="capitalize">{PANEL_LABELS[panelKey]} panel</span>
                                      {hasActivity && <span className="text-[10px] text-emerald-400 font-medium">Visited</span>}
                                    </div>

                                    {hasActivity ? (
                                      <div className="mt-1.5 space-y-1">
                                        <p className="font-mono text-[10px] text-neutral-300 truncate bg-neutral-950 dark:bg-neutral-900/60 p-1 rounded">
                                          {panelActivity.lastPage}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 flex items-center gap-1 font-sans">
                                          <Clock className="size-3 inline" />
                                          {formatRelativeTime(panelActivity.lastVisitedAt)}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="mt-1 text-[11px] text-neutral-400 italic">No recorded visits in this panel.</p>
                                    )}

                                    {/* Small arrow triangle */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900 dark:border-t-neutral-800"></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </td>

                        {/* Expand chevron actions */}
                        <td className="p-3 pr-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandRow(userItem.userId);
                            }}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded details row */}
                      {isExpanded && (
                        <tr className="bg-neutral-50/30 dark:bg-neutral-900/5">
                          <td colSpan={7} className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="max-w-4xl mx-auto rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-4 space-y-4 shadow-inner">
                              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Per-Panel Breakdown Timeline &bull; {userItem.name}
                                  </h3>
                                </div>
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                                  User ID: {userItem.userId}
                                </span>
                              </div>

                              {activePanels.length > 0 ? (
                                <div className="space-y-2">
                                  {activePanels.map((panelKey) => {
                                    const activity = userItem.panels[panelKey]!;
                                    const label = PANEL_LABELS[panelKey];

                                    let badgeColor = "";
                                    switch (panelKey) {
                                      case "admin": badgeColor = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30"; break;
                                      case "sales": badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30"; break;
                                      case "construction": badgeColor = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30"; break;
                                      case "plant": badgeColor = "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30"; break;
                                      case "account": badgeColor = "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30"; break;
                                    }

                                    return (
                                      <div
                                        key={panelKey}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/20 gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border shrink-0 ${badgeColor}`}>
                                            {label}
                                          </span>
                                          <span className="font-mono text-xs text-neutral-800 dark:text-neutral-300 truncate" title={activity.lastPage}>
                                            {activity.lastPage}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-neutral-450 dark:text-neutral-500 shrink-0 font-mono self-end sm:self-auto">
                                          <Clock className="size-3.5" />
                                          <span>{formatRelativeTime(activity.lastVisitedAt)}</span>
                                          <span className="text-neutral-300 dark:text-neutral-700">|</span>
                                          <span>{formatFullDate(activity.lastVisitedAt)}</span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                                  <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                                    No recorded panel activity history for this user.
                                  </p>
                                </div>
                              )}

                              {userItem.lastPage && (
                                <div className="flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 p-2.5 rounded-lg text-xs border border-neutral-100 dark:border-neutral-850">
                                  <span className="text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    Most recent active page:
                                    <strong className="text-neutral-800 dark:text-neutral-200 capitalize font-semibold ml-0.5">
                                      {userItem.lastPage.panel}
                                    </strong>
                                  </span>
                                  <span className="font-mono text-neutral-600 dark:text-neutral-400 select-all truncate max-w-[400px]">
                                    {userItem.lastPage.page}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
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
                <span className="font-bold text-neutral-950 dark:text-neutral-50">
                  {Math.ceil(pagination.total / pagination.limit) || 1}
                </span>
              </div>

              {/* Next Page */}
              <button
                onClick={() => setPage(p => Math.min(p + 1, Math.ceil(pagination.total / pagination.limit)))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="size-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setPage(Math.ceil(pagination.total / pagination.limit))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
export default ActivityLog
