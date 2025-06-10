"use client";

import { useState, useEffect } from "react";
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
import { Search, Eye, Activity, Calendar } from "lucide-react";

export default function AdminSubscriptionEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/subscription-events", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching subscription events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.subscriptionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.newStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "created":
        return "default";
      case "updated":
        return "secondary";
      case "canceled":
        return "destructive";
      case "reactivated":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "canceled":
        return "destructive";
      case "incomplete":
        return "secondary";
      default:
        return "outline";
    }
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
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
        <h1 className="text-2xl font-bold text-gray-900">
          Subscription Events
        </h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
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
            All Subscription Events ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>New Status</TableHead>
                  <TableHead>Cancel at Period End</TableHead>
                  <TableHead>Processed At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant={getEventTypeColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {event.subscriptionId?.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.newStatus)}>
                        {event.newStatus || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.cancelAtPeriodEnd ? "destructive" : "default"
                        }
                      >
                        {event.cancelAtPeriodEnd ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(event.processedAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewEventDetails(event)}
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

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Subscription Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="grid gap-6 py-4">
              {/* Event Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Event Type
                    </label>
                    <Badge variant={getEventTypeColor(selectedEvent.eventType)}>
                      {selectedEvent.eventType}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      New Status
                    </label>
                    <Badge variant={getStatusColor(selectedEvent.newStatus)}>
                      {selectedEvent.newStatus || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cancel at Period End
                    </label>
                    <Badge
                      variant={
                        selectedEvent.cancelAtPeriodEnd
                          ? "destructive"
                          : "default"
                      }
                    >
                      {selectedEvent.cancelAtPeriodEnd ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-1">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Subscription ID
                    </label>
                    <p className="text-sm font-mono">
                      {selectedEvent.subscriptionId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-sm font-mono">{selectedEvent.userId}</p>
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
                <CardContent className="grid gap-4 md:grid-cols-1">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Processed At
                    </label>
                    <p className="text-sm">
                      {formatDateTime(selectedEvent.processedAt)}
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
}
