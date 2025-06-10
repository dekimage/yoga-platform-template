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
      const daysLeft = Math.ceil(
        (user.subscriptionEndsAt - new Date()) / (1000 * 60 * 60 * 24)
      );
      return {
        text: `Ends in ${daysLeft} days`,
        variant: "destructive",
        detail: `Access until ${user.subscriptionEndsAt.toLocaleDateString()}`,
      };
    }

    return { text: "Premium Member", variant: "default" };
  };

  const status = getSubscriptionStatus();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
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
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={status.variant} className="text-xs">
                {status.text}
              </Badge>
            </div>
            {status.detail && (
              <p className="text-xs text-muted-foreground">{status.detail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/videos")}>
            My Videos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/billing")}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => authStore.logout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
