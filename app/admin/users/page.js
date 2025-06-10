"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Calendar,
  Mail,
  User,
  CreditCard,
  RefreshCw,
} from "lucide-react";

const AdminUsers = observer(() => {
  const { adminStore } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  useEffect(() => {
    adminStore.fetchUsers();
  }, [adminStore]);

  const filteredUsers = adminStore.users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleRefresh = () => {
    adminStore.refreshUsers();
  };

  if (adminStore.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            All Users ({filteredUsers.length}) - Cached in MobX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.activeMember ? "default" : "secondary"}
                      >
                        {user.activeMember ? "Active Member" : "Free User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.subscriptionStatus || "None"}</div>
                        {user.subscriptionEndsAt && (
                          <div className="text-gray-500">
                            Ends: {formatDate(user.subscriptionEndsAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewUserDetails(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details: {selectedUser?.fullName}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6 py-4">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-sm">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Active Member
                    </label>
                    <Badge
                      variant={
                        selectedUser.activeMember ? "default" : "secondary"
                      }
                    >
                      {selectedUser.activeMember ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Marketing Consent
                    </label>
                    <Badge
                      variant={
                        selectedUser.marketingConsent ? "default" : "secondary"
                      }
                    >
                      {selectedUser.marketingConsent ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Subscription Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p className="text-sm">
                      {selectedUser.subscriptionStatus || "None"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Will Renew
                    </label>
                    <Badge
                      variant={
                        selectedUser.willRenew ? "default" : "destructive"
                      }
                    >
                      {selectedUser.willRenew ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Subscription ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedUser.subscriptionId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Polar Customer ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedUser.polarCustomerId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Subscription Ends At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.subscriptionEndsAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Canceled At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.canceledAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Analytics & Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Minutes Watched
                    </label>
                    <p className="text-sm">
                      {selectedUser.analytics?.minutesWatched || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Months Paid
                    </label>
                    <p className="text-sm">{selectedUser.monthsPaid || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Completed Videos
                    </label>
                    <p className="text-sm">
                      {selectedUser.analytics?.completedVideos?.length || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Favorite Videos
                    </label>
                    <p className="text-sm">
                      {selectedUser.favoriteVideos?.length || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Session
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.analytics?.lastSession)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Notifications
                    </label>
                    <Badge
                      variant={
                        selectedUser.preferences?.notifications
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.preferences?.notifications
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Updated At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Webhook Processed At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedUser.webhookProcessedAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Order ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedUser.lastOrderId || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default AdminUsers;
