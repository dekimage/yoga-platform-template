import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Transform Your Practice with <span className="text-primary">Premium Yoga</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access hundreds of high-quality yoga videos from expert instructors. Practice anytime, anywhere, and elevate
          your yoga journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/subscribe">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Login
            </Button>
          </Link>
        </div>
        <div className="mt-16">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Yoga practice"
            className="mx-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
