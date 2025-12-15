"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/Header"
import { API_ENDPOINTS } from "@/lib/api-config"

interface Book {
  id: number
  title: string
  isbn: string
  publicationYear: number
  authorId: number
  authorName?: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [searchAuthor, setSearchAuthor] = useState("")
  const [activeTab, setActiveTab] = useState<"random" | "author" | "recent">("random")
  const { toast } = useToast()

  useEffect(() => {
    fetchRandomRecommendations()
  }, [])

  const fetchRandomRecommendations = async (count = 6) => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.recommendations.random(count))
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setRecommendations(Array.isArray(data) ? data : [])
      setActiveTab("random")
    } catch (error) {
      console.error("Erreur lors du chargement des recommandations:", error)
      setRecommendations([])
      toast({ title: "Erreur", description: "Échec du chargement des recommandations", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.recommendations.recent)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setRecommendations(Array.isArray(data) ? data : [])
      setActiveTab("recent")
    } catch (error) {
      console.error("Erreur lors du chargement des livres récents:", error)
      setRecommendations([])
      toast({ title: "Erreur", description: "Échec du chargement des livres récents", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchByAuthor = async (authorName: string) => {
    if (!authorName.trim()) {
      toast({ title: "Erreur", description: "Entrez un nom d'auteur", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.recommendations.byAuthor(authorName))
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setRecommendations(Array.isArray(data) ? data : [])
      setActiveTab("author")
    } catch (error) {
      console.error("Erreur lors de la recherche par auteur:", error)
      setRecommendations([])
      toast({ title: "Erreur", description: "Échec de la recherche par auteur", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activePage="recommendations" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-1">Recommandations</h2>
          <p className="text-sm text-muted-foreground">Découvrez des livres</p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button size="sm" variant={activeTab === "random" ? "default" : "outline"} onClick={() => fetchRandomRecommendations()}>
            Aléatoire
          </Button>
          <Button size="sm" variant={activeTab === "recent" ? "default" : "outline"} onClick={fetchRecentRecommendations}>
            Récents
          </Button>
          <div className="flex gap-2">
            <Input
              placeholder="Nom de l'auteur"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchByAuthor(searchAuthor)}
              className="w-40 h-8 text-sm"
            />
            <Button size="sm" variant="outline" onClick={() => fetchByAuthor(searchAuthor)}>
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Résultats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {activeTab === "random" && "Sélection aléatoire"}
              {activeTab === "recent" && "Livres récents"}
              {activeTab === "author" && "Par auteur"}
            </CardTitle>
            <CardDescription>{recommendations.length} livre{recommendations.length > 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucun livre trouvé</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendations.map((book) => (
                  <div key={book.id} className="p-4 border rounded-md">
                    <h4 className="font-medium text-sm mb-1">{book.title}</h4>
                    {book.authorName && <p className="text-xs text-muted-foreground">par {book.authorName}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{book.publicationYear} · {book.isbn}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
