"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Users,
  Award,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Leaf,
} from "lucide-react";

export default function Home() {
  const theme = useTheme();

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200/30 rounded-full blur-xl animate-gentle-float"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl animate-gentle-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 mb-8 shadow-lg shadow-rose-200/50">
              <Heart className="w-4 h-4 text-rose-500 mr-2" />
              <span className="text-sm font-medium text-rose-700 font-body">
                Find Your Inner Balance
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-800 mb-6">
              Embrace Your
              <span className="block text-gradient-primary font-accent text-5xl md:text-7xl lg:text-8xl mt-2">
                Yoga Journey
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-body">
              Discover peace, strength, and flexibility through our gentle
              approach to yoga. Join a community that nurtures your mind, body,
              and spirit.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button className="btn-primary text-lg px-10 py-5 font-medium">
                  Begin Your Practice
                  <Leaf className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/login">
                <Button className="btn-secondary text-lg px-10 py-5">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Preview
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="font-body">7-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="font-body">Gentle for all levels</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="font-body">Mindful community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-2">
                10K+
              </div>
              <div className="text-gray-600 font-body">
                Peaceful Practitioners
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-2">
                500+
              </div>
              <div className="text-gray-600 font-body">Gentle Classes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-2">
                50+
              </div>
              <div className="text-gray-600 font-body">Mindful Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-2">
                4.9★
              </div>
              <div className="text-gray-600 font-body">Love & Peace</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 gradient-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-800 mb-4">
              Why Choose Our
              <span className="text-gradient-primary font-accent">
                {" "}
                Gentle{" "}
              </span>
              Approach?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed">
              Everything you need for a peaceful and transformative yoga
              practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: "Crystal Clear Videos",
                description:
                  "Beautiful HD streaming with multiple gentle angles to guide your practice with clarity and grace.",
              },
              {
                icon: Users,
                title: "Nurturing Instructors",
                description:
                  "Learn from certified teachers who embrace mindfulness and create a safe space for all bodies.",
              },
              {
                icon: Clock,
                title: "Flexible Practice",
                description:
                  "From 5-minute meditations to 90-minute flows, practice at your own peaceful pace.",
              },
              {
                icon: Award,
                title: "Mindful Progress",
                description:
                  "Track your journey with gentle milestones that celebrate every step of your growth.",
              },
              {
                icon: Star,
                title: "Personal Sanctuary",
                description:
                  "Customized sequences that honor your unique body and create your personal practice.",
              },
              {
                icon: Heart,
                title: "Loving Community",
                description:
                  "Connect with like-minded souls on a shared journey of wellness and self-discovery.",
              },
            ].map((feature, index) => (
              <Card key={index} className="card-theme card-hover group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-soft-pulse"></div>
        <div
          className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-soft-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to
            <span className="font-accent"> Blossom </span>
            Into Your Best Self?
          </h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto font-body leading-relaxed">
            Join our nurturing community today and begin a gentle journey toward
            inner peace, strength, and radiant well-being.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button className="bg-white text-rose-600 hover:bg-rose-50 text-lg px-10 py-5 font-medium rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-300">
                Start Your Journey
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-rose-600 text-lg px-10 py-5 rounded-2xl transition-all duration-300">
                Welcome Back
              </Button>
            </Link>
          </div>

          <p className="text-rose-200 text-sm mt-8 font-body">
            No pressure • Cancel anytime • 7 days of gentle exploration
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
