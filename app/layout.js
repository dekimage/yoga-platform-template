import { Inter } from "next/font/google";
import NoSSRThemeProvider from "@/components/no-ssr-theme-provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StoreProvider } from "@/stores/StoreProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Yoga Platform",
  description: "Premium yoga videos for your practice",
  generator: "Dejan Gavrilovic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider>
          <StoreProvider>
            <NoSSRThemeProvider>{children}</NoSSRThemeProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
