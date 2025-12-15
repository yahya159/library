"use client"

import Link from "next/link"
import { BookOpen, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"

export default function HomePage() {
  const features = [
    {
      href: "/books",
      icon: BookOpen,
      title: "Livres & Auteurs",
      description: "Gérez votre catalogue de livres et les informations des auteurs.",
    },
    {
      href: "/loans",
      icon: Users,
      title: "Gestion des Emprunts",
      description: "Suivez les emprunts et gérez les retours.",
    },
    {
      href: "/recommendations",
      icon: TrendingUp,
      title: "Recommandations",
      description: "Découvrez des livres par auteurs et tendances.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-3">
            Gestion de Bibliothèque
          </h2>
          <p className="text-muted-foreground">
            Gérez les livres, suivez les emprunts et découvrez des recommandations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:border-foreground/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-foreground">
                    Voir →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
