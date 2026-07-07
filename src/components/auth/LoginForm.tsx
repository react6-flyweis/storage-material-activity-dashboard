import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Activity, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
})

type LoginFields = z.infer<typeof loginSchema>

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: LoginFields) => {
    setLoading(true)
    setServerError(null)

    try {
      const response = await api.post("/api/auth/login", data)
      const result = response.data

      if (!result.success) {
        throw new Error(result.message || "Authentication failed")
      }

      const { accessToken, refreshToken, role, user } = result.data

      if (role !== "admin") {
        throw new Error("Access Denied: You must have the admin role to view this dashboard.")
      }

      setAuth(accessToken, refreshToken || "", user)
    } catch (err: unknown) {
      console.error("Login failed:", err)
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const message = error.response?.data?.message || error.message || "An unexpected error occurred."
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 transition-colors duration-200 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000"></div>

      <div className="w-full max-w-md bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 p-8 rounded-2xl shadow-2xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 text-primary p-3 rounded-2xl border border-primary/20 dark:bg-primary/20 mb-3">
            <Activity className="size-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Activity Log Portal
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <Alert className="bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
              <AlertCircle className="size-4.5 shrink-0" />
              <AlertTitle className="text-xs font-semibold">Sign In Failed</AlertTitle>
              <AlertDescription className="text-xs opacity-90">{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              className={errors.email ? "border-rose-500 focus-visible:ring-rose-500/20" : "dark:border-neutral-850"}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-rose-500 focus-visible:ring-rose-500/20" : "dark:border-neutral-850"}
            />
            {errors.password && (
              <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>


      </div>
    </div>
  )
}
export default LoginForm
