import { useState, useEffect } from "react"
import { useActivityLogs } from "./activity-log/useActivityLogs"
import { ActivityFilter } from "./activity-log/ActivityFilter"
import { ActivityTable } from "./activity-log/ActivityTable"

export function ActivityLog() {
  // Filter states
  const [searchVal, setSearchVal] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [pollInterval, setPollInterval] = useState<number>(5000) // Default polling 5s

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal)
      setPage(1) // Reset page on search change
    }, 350)
    return () => clearTimeout(handler)
  }, [searchVal])

  // Fetch page activity from the API using React Query custom hook
  const { data, isLoading, isError, error, refetch, isFetching } = useActivityLogs({
    roleFilter,
    statusFilter,
    debouncedSearch,
    page,
    limit,
    refetchInterval: pollInterval > 0 ? pollInterval : false
  })

  // Reset all filters to defaults
  const handleClearFilters = () => {
    setSearchVal("")
    setDebouncedSearch("")
    setRoleFilter("")
    setStatusFilter("")
    setPage(1)
    setLimit(10)
    setPollInterval(5000)
  }

  // Handle individual filter changes that need page reset
  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val)
    setPage(1)
  }

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val)
    setPage(1)
  }

  const handleLimitChange = (val: number) => {
    setLimit(val)
    setPage(1)
  }

  // Extract items and pagination data
  const items = data?.items || []
  const pagination = data?.pagination || { page: 1, limit: limit, total: 0 }

  return (
    <div className="space-y-6">
      <ActivityFilter
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        roleFilter={roleFilter}
        setRoleFilter={handleRoleFilterChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        limit={limit}
        setLimit={handleLimitChange}
        pollInterval={pollInterval}
        setPollInterval={setPollInterval}
        onClearFilters={handleClearFilters}
      />

      <ActivityTable
        items={items}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        refetch={refetch}
        pagination={pagination}
        setPage={setPage}
        onClearFilters={handleClearFilters}
        searchVal={searchVal}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
      />
    </div>
  )
}

export default ActivityLog
