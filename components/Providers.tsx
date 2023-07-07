"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const Providers = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;