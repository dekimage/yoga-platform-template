"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { cn } from "@/lib/utils";

export const Sidebar = observer(() => {
  const pathname = usePathname();
  const { authStore } = useStore();

  const isAdmin = authStore.user?.isAdmin;

  const links = [
    {
      href: "/dashboard/videos",
      label: "Videos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
    },
    {
      href: "/dashboard/playlists",
      label: "Playlists",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M16 6H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1Z"></path>
          <path d="M16 12H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1Z"></path>
          <path d="M16 18H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1Z"></path>
          <circle cx="20" cy="4" r="2"></circle>
          <circle cx="20" cy="10" r="2"></circle>
          <circle cx="20" cy="16" r="2"></circle>
        </svg>
      ),
    },
    {
      href: "/dashboard/favorites",
      label: "Favorites",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
        </svg>
      ),
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="5"></circle>
          <path d="M20 21a8 8 0 0 0-16 0"></path>
        </svg>
      ),
    },
    {
      href: "/dashboard/billing",
      label: "Billing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
    },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    links.push({
      href: "/dashboard/admin",
      label: "Admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
    });
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
          <span className="text-xl font-bold">Yoga Platform</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted h-9 w-9 flex items-center justify-center">
            <span className="text-sm font-medium">
              {authStore.user?.fullName?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">
              {authStore.user?.fullName || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {authStore.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
