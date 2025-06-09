import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsOverview({ data }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Total Watch Time</CardTitle>
          <CardDescription>Minutes watched across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{Math.round(data.totalWatchTime || 0).toLocaleString()} min</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Videos</CardTitle>
          <CardDescription>Most watched content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.popularVideos?.slice(0, 5).map((video, index) => (
              <div key={video.id} className="flex justify-between">
                <span className="text-sm truncate">{video.title}</span>
                <span className="text-sm text-muted-foreground">{video.views} views</span>
              </div>
            )) || <p className="text-muted-foreground">No data available</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Average session duration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{Math.round(data.avgSessionDuration || 0)} min</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Videos completed vs started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{Math.round(data.completionRate || 0)}%</div>
        </CardContent>
      </Card>
    </div>
  )
}
