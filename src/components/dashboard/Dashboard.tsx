import { useQueryClient, useIsFetching } from "@tanstack/react-query"
import { Header } from "@/components/dashboard/Header"
import { ActivityLog } from "@/components/dashboard/ActivityLog"

export function Dashboard() {
  const queryClient = useQueryClient()

  // Hook to track if any 'activityLogs' query is currently fetching/loading in the background
  const fetchingCount = useIsFetching({ queryKey: ["activityLogs"] })
  const isRefreshing = fetchingCount > 0

  const handleGlobalRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["activityLogs"] })
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-50 flex flex-col">
      <Header onRefresh={handleGlobalRefresh} isRefreshing={isRefreshing} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <ActivityLog />
      </main>

      <footer className="py-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-200">
        <p>&copy; {new Date().getFullYear()} Activity Dashboard. All rights reserved.</p>
      </footer>
    </div>
  )
}
export default Dashboard
