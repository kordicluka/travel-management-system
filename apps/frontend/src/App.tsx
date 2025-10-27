import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { router } from "./router";
import { AuthInitializer } from "./components/auth";
import { ErrorBoundary, ErrorFallback } from "./components/common";

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AuthInitializer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
