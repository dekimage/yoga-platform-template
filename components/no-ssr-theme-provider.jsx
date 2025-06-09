"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme-provider";

const NoSSRThemeProvider = dynamic(() => Promise.resolve(ThemeProvider), {
  ssr: false,
  loading: () => <div>{/* Fallback content */}</div>,
});

export default NoSSRThemeProvider;
