"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function UserTable({ users, onToggleActivation }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Joined</th>
            <th className="text-left p-2">Watch Time</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="p-2">
                <Badge variant={user.activeMember ? "default" : "secondary"}>
                  {user.activeMember ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="p-2">
                <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
              </td>
              <td className="p-2">
                <span className="text-sm">{Math.round(user.analytics?.minutesWatched || 0)} min</span>
              </td>
              <td className="p-2">
                <Button variant="outline" size="sm" onClick={() => onToggleActivation(user.id, !user.activeMember)}>
                  {user.activeMember ? "Deactivate" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
