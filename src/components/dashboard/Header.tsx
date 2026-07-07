import { Activity, RotateCcw, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AD"

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20 dark:bg-primary/20">
            <Activity className="size-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight leading-none flex items-center gap-2">
              Activity Log
              {/* <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20">
                Admin
              </span> */}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              User navigation events & panel breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 pr-2 border-r border-neutral-200 dark:border-neutral-800">
              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs select-none">
                {userInitials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-tight text-neutral-800 dark:text-neutral-200">
                  {user.name}
                </p>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-none capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Refresh logs"
            >
              <RotateCcw className={`size-4.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs font-semibold py-1.5 h-auto text-rose-500 hover:text-rose-600 border-rose-200 hover:bg-rose-500/10 dark:border-rose-950/50 dark:hover:bg-rose-950/20 cursor-pointer"
          >
            Log Out
          </Button>
        </div>
      </div>
    </header>
  )
}
export default Header
