import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { ApiResponse } from "./types"

interface UseActivityLogsParams {
  roleFilter: string;
  statusFilter: string;
  debouncedSearch: string;
  page: number;
  limit: number;
  refetchInterval?: number | false;
}

export function useActivityLogs({
  roleFilter,
  statusFilter,
  debouncedSearch,
  page,
  limit,
  refetchInterval
}: UseActivityLogsParams) {
  return useQuery<ApiResponse>({
    queryKey: ["activityLogs", { roleFilter, statusFilter, debouncedSearch, page, limit }],
    queryFn: async () => {
      const params: {
        page: number;
        limit: number;
        role?: string;
        isActive?: string;
        search?: string;
      } = {
        page,
        limit
      }
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.isActive = statusFilter
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()

      const response = await api.get("/api/admin/activity/page-visits", { params })
      return response.data.data
    },
    refetchInterval
  })
}

