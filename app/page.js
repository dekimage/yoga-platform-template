"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Quote,
  Globe,
  Instagram,
  Youtube,
  ChevronRight,
  BookOpen,
  Video,
  Zap,
  Shield,
  Infinity,
  Target,
} from "lucide-react";

export default function Home() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch authors for the Meet the Authors section
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");
        const data = await response.json();
        setAuthors(data.slice(0, 3)); // Show only top 3 authors
      } catch (error) {
        console.error("Error fetching authors:", error);
        // Fallback to dummy data
        setAuthors([
          {
            id: "1",
            name: "Sarah Johnson",
            bio: "Certified yoga instructor with 10+ years of experience in Hatha and Vinyasa yoga.",
            avatar: "/placeholder-user.jpg",
            specialties: ["Hatha", "Vinyasa", "Meditation"],
          },
          {
            id: "2",
            name: "Michael Chen",
            bio: "Power yoga specialist and mindfulness coach focusing on strength and flexibility.",
            avatar: "/placeholder-user.jpg",
            specialties: ["Power Yoga", "Mindfulness", "Strength"],
          },
          {
            id: "3",
            name: "Emma Rodriguez",
            bio: "Restorative yoga expert helping students find peace and balance in their practice.",
            avatar: "/placeholder-user.jpg",
            specialties: ["Restorative", "Yin Yoga", "Meditation"],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Yoga Enthusiast",
      content:
        "This platform has completely transformed my practice. The quality of instruction is outstanding, and I love being able to practice at my own pace.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "David Thompson",
      role: "Beginner Yogi",
      content:
        "As someone new to yoga, I was intimidated to start. The beginner-friendly classes here made it so easy to get started and build confidence.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Maria Santos",
      role: "Advanced Practitioner",
      content:
        "Even as an experienced yogi, I continue to learn and grow with these classes. The variety and depth of content is impressive.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
  ];

  const features = [
    {
      icon: Video,
      title: "HD Video Quality",
      description:
        "Crystal clear streaming with multiple camera angles for perfect form guidance.",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description:
        "Learn from certified teachers with years of experience and specialized training.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Practice anytime with classes ranging from 5-minute meditations to 90-minute flows.",
    },
    {
      icon: Target,
      title: "All Levels Welcome",
      description:
        "From complete beginners to advanced practitioners, find your perfect practice.",
    },
    {
      icon: BookOpen,
      title: "Curated Playlists",
      description:
        "Structured programs and themed collections to guide your yoga journey.",
    },
    {
      icon: Infinity,
      title: "Unlimited Access",
      description:
        "Stream unlimited classes across all devices with your subscription.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-foreground text-background mb-8 text-sm font-medium">
              <Heart className="w-4 h-4 mr-2" />
              Transform Your Practice
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Find Your Inner
              <span className="block text-foreground mt-2">Balance</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of practitioners in discovering peace, strength,
              and flexibility through our expert-led yoga classes. Practice
              anywhere, anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 rounded-full"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-foreground text-foreground hover:bg-foreground hover:text-background text-lg px-8 py-6 rounded-full"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Preview
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-foreground mr-2" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-foreground mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-foreground mr-2" />
                <span>All levels welcome</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                10K+
              </div>
              <div className="text-muted-foreground">Happy Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                500+
              </div>
              <div className="text-muted-foreground">Video Classes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                4.9★
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete yoga platform designed to support your practice and
              growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Authors Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Meet Your Teachers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from certified instructors who are passionate about sharing
              the transformative power of yoga
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {authors.map((author, index) => (
                <Card
                  key={author.id}
                  className="border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6">
                      <img
                        src={
                          author.avatar?.startsWith("/")
                            ? author.avatar
                            : `https:${author.avatar}`
                        }
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {author.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {author.bio}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {author.specialties?.map((specialty, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-foreground text-foreground"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
              >
                Start Learning Today
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of yogis who have transformed their practice with
              our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-foreground mb-4" />
                  </div>
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-foreground text-foreground"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              One plan, unlimited access to all premium content
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Monthly Subscription
                </h3>
                <div className="text-4xl font-bold text-foreground mb-6">
                  $12
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  {[
                    "Unlimited access to all videos",
                    "New content added weekly",
                    "HD video quality",
                    "Progress tracking",
                    "All device access",
                    "Cancel anytime",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-foreground mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/subscribe">
                  <Button
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full"
                  >
                    Start Your Practice Today
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">
                  7-day free trial • No commitment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Join our community today and begin your journey toward inner peace,
            strength, and well-being.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 rounded-full"
              >
                Start Free Trial
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-background text-black hover:bg-background hover:text-foreground text-lg px-8 py-6 rounded-full"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-background/70 text-sm mt-8">
            No credit card required • Cancel anytime • Join 10,000+ happy
            members
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
