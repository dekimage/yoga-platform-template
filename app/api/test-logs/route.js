export async function GET() {
  console.log("🎯 TEST LOG: This should appear in your terminal");
  console.log("📦 Current time:", new Date().toISOString());

  return Response.json({
    message: "Check your terminal for logs",
    timestamp: new Date().toISOString(),
  });
}
