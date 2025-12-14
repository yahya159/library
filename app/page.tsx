"use client"

import Link from "next/link"
import { BookOpen, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div
            className={`flex items-center justify-between transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div className="flex items-center gap-2 group">
              <BookOpen className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/books">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Books
                </Button>
              </Link>
              <Link href="/loans">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Loans
                </Button>
              </Link>
              <Link href="/recommendations">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Recommendations
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient">
            Library Management System
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Streamline your library operations with our comprehensive management platform. Manage books, track loans,
            and discover recommendations with ease.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              href: "/books",
              icon: BookOpen,
              title: "Books & Authors",
              description: "Manage your book catalog and author information with full CRUD operations.",
              buttonText: "Manage Books",
              delay: "300",
            },
            {
              href: "/loans",
              icon: Users,
              title: "Loan Management",
              description: "Track book loans, borrower information, and manage returns efficiently.",
              buttonText: "Manage Loans",
              delay: "500",
            },
            {
              href: "/recommendations",
              icon: TrendingUp,
              title: "Recommendations",
              description: "Discover book recommendations based on authors and recent publications.",
              buttonText: "View Recommendations",
              delay: "700",
            },
          ].map((feature, index) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`group transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <Card className="h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-2 relative overflow-hidden">
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    variant="secondary"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-md"
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section
        className={`container mx-auto px-4 py-16 transition-all duration-1000 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Book Catalog", value: "Complete", icon: BookOpen },
            { label: "Loan Tracking", value: "Real-time", icon: Users },
            { label: "Recommendations", value: "Available", icon: TrendingUp },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
