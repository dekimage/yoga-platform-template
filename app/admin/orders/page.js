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
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminOrders = observer(() => {
  const { adminStore } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    // Ensure users are cached first
    adminStore.fetchUsers();
    fetchOrders(1);
  }, [adminStore]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/orders?page=${page}&limit=100`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.polarOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.polarCustomerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adminStore
        .getUserInfo(order.userId)
        .email?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount, currency) => {
    if (!amount) return "N/A";
    return `${(amount / 100).toFixed(2)} ${currency?.toUpperCase() || "USD"}`;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchOrders(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchOrders(pagination.page + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
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
            Orders ({filteredOrders.length} of {pagination.total}) - Page{" "}
            {pagination.page} of {pagination.totalPages}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const userInfo = adminStore.getUserInfo(order.userId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {order.polarOrderId?.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatAmount(order.amount, order.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "paid" ? "default" : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {userInfo.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userInfo.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {pagination.total} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog - Enhanced with user info */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Customer Info - Enhanced with cached user data */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {(() => {
                    const userInfo = adminStore.getUserInfo(
                      selectedOrder.userId
                    );
                    return (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Full Name
                          </label>
                          <p className="text-sm">{userInfo.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Email
                          </label>
                          <p className="text-sm">{userInfo.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Member Status
                          </label>
                          <Badge
                            variant={
                              userInfo.activeMember ? "default" : "secondary"
                            }
                          >
                            {userInfo.activeMember
                              ? "Active Member"
                              : "Free User"}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Subscription Status
                          </label>
                          <p className="text-sm">
                            {userInfo.subscriptionStatus}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-sm font-mono">{selectedOrder.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Polar Customer ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedOrder.polarCustomerId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Polar Order ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedOrder.polarOrderId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Amount
                    </label>
                    <p className="text-sm font-semibold">
                      {formatAmount(
                        selectedOrder.amount,
                        selectedOrder.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Currency
                    </label>
                    <p className="text-sm">
                      {selectedOrder.currency?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <Badge
                      variant={
                        selectedOrder.status === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Processed
                    </label>
                    <Badge
                      variant={
                        selectedOrder.processed ? "default" : "destructive"
                      }
                    >
                      {selectedOrder.processed ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Paid At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedOrder.paidAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Webhook Processed At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedOrder.webhookProcessedAt)}
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

export default AdminOrders;
