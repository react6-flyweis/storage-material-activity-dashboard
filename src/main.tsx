import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ErrorBoundary } from "@/components/common/ErrorBoundary.tsx"
import App from "./App.tsx"
import "./index.css"

// Create TanStack Query Client with secure, robust global defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic background refetching on window focus
      retry: 1, // Only retry failed requests once to avoid unnecessary API spamming
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider defaultTheme="system" storageKey="theme"> */}
          <App />
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
