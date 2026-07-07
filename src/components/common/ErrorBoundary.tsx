import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 transition-colors duration-200">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
            <div className="mx-auto bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-rose-500/20">
              <AlertCircle className="size-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Something went wrong
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                An unexpected application error occurred. You can try reloading the page.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left">
                <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 break-all select-all">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <Button onClick={this.handleReload} className="w-full font-semibold cursor-pointer">
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
