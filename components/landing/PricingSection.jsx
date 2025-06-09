import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One plan, unlimited access to all premium content
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-card border rounded-lg p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Monthly Subscription</h3>
            <div className="text-4xl font-bold mb-4">
              $12<span className="text-lg text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited access to all videos
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                New content added weekly
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                HD video quality
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Progress tracking
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Cancel anytime
              </li>
            </ul>
            <Link href="/subscribe">
              <Button size="lg" className="w-full">
                Start Your Practice Today
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">No commitment. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
