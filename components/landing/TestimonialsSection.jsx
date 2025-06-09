export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Yoga Enthusiast",
      content:
        "This platform has completely transformed my practice. The quality of instruction is outstanding, and I love being able to practice at my own pace.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "Beginner Yogi",
      content:
        "As someone new to yoga, I was intimidated to start. The beginner-friendly classes here made it so easy to get started and build confidence.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emma Rodriguez",
      role: "Advanced Practitioner",
      content:
        "Even as an experienced yogi, I continue to learn and grow with these classes. The variety and depth of content is impressive.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of yogis who have transformed their practice with our platform
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
