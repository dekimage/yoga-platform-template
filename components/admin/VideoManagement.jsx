import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function VideoManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Management</CardTitle>
        <CardDescription>Manage video content and metadata</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Video content is managed through Contentful CMS</p>
          <Button variant="outline">Open Contentful Dashboard</Button>
        </div>
      </CardContent>
    </Card>
  )
}
