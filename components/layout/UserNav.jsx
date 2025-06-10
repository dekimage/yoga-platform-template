"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";

const getAvatarShortcut = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to safely convert Firestore timestamp to Date
const convertToDate = (timestamp) => {
  if (!timestamp) return null;

  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;

  // If it's a Firestore timestamp with seconds property
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  // If it's a string, try to parse it
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }

  // If it's a number (Unix timestamp)
  if (typeof timestamp === "number") {
    return new Date(timestamp * 1000);
  }

  return null;
};

export const UserNav = observer(() => {
  const router = useRouter();
  const { authStore } = useStore();
  const { user } = authStore;

  if (!user) return null;

  const getSubscriptionStatus = () => {
    if (!user?.activeMember) {
      return { text: "No Subscription", variant: "secondary" };
    }

    if (user.subscriptionStatus === "canceled" && user.subscriptionEndsAt) {
      const endDate = convertToDate(user.subscriptionEndsAt);

      if (endDate) {
        const daysLeft = Math.ceil(
          (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          text: `Ends in ${daysLeft} days`,
          variant: "destructive",
          detail: `Access until ${endDate.toLocaleDateString()}`,
        };
      }
    }

    return { text: "Premium Member", variant: "default" };
  };

  const status = getSubscriptionStatus();

  const handleLogout = () => {
    authStore.logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback>{getAvatarShortcut(user.fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Badge variant={status.variant} className="text-xs">
              {status.text}
            </Badge>
            {status.detail && (
              <p className="text-xs text-muted-foreground mt-1">
                {status.detail}
              </p>
            )}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/videos")}>
            Videos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/favorites")}>
            Favorites
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/billing")}>
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
