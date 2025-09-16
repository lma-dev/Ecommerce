"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface TanStackProviderProps {
  children: React.ReactNode;
}
const TanStackQueryClientProvider = ({ children }: TanStackProviderProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Fetch fresh data every 1 minute by default
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanStackQueryClientProvider;
