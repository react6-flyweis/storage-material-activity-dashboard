import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 transition-colors duration-200 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 p-8 rounded-2xl shadow-xl text-center relative z-10 space-y-6">
        <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center border border-primary/20">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
            404
          </h1>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-205">
            Page Not Found
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            The link you followed may be broken or the page may have been removed.
          </p>
        </div>

        <Button onClick={() => navigate("/")} className="w-full font-semibold cursor-pointer">
          Back to Safety
        </Button>
      </div>
    </div>
  )
}
export default NotFound
