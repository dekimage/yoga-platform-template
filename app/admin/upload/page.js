"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !title) {
      setError("Please select a file and enter a title");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // First, create the video in Bunny.net
      const createResponse = await fetch("/api/admin/videos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create video");
      }

      const videoData = await createResponse.json();
      console.log("Created video:", videoData);

      // Then upload the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("videoId", videoData.guid);

      const uploadResponse = await fetch("/api/admin/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video");
      }

      const uploadResult = await uploadResponse.json();
      setResult({
        ...videoData,
        ...uploadResult,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Video to Bunny.net</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Video Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Video File</label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <h3 className="font-medium mb-2">Upload Successful!</h3>
              <p>
                <strong>Video ID:</strong> {result.guid}
              </p>
              <p>
                <strong>Title:</strong> {result.title}
              </p>
              <p className="text-sm mt-2">
                Copy this Video ID and use it in your Contentful entry:
                <code className="bg-white px-2 py-1 rounded ml-2">
                  {result.guid}
                </code>
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !title}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
