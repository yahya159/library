"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const API_URL = "http://localhost:8080/recommendation-service/api/recommendations"

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
  const [recommendationType, setRecommendationType] = useState<"random" | "author" | "recent">("random")
  const { toast } = useToast()

  useEffect(() => {
    fetchRandomRecommendations()
  }, [])

  const fetchRandomRecommendations = async (count = 6) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}?count=${count}`)
      const data = await response.json()
      setRecommendations(data)
      setRecommendationType("random")
    } catch (error) {
      console.error("[v0] Error fetching recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/recent`)
      const data = await response.json()
      setRecommendations(data)
      setRecommendationType("recent")
    } catch (error) {
      console.error("[v0] Error fetching recent recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recent recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchByAuthor = async (authorName: string) => {
    if (!authorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an author name",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/author/${encodeURIComponent(authorName)}`)
      const data = await response.json()
      setRecommendations(data)
      setRecommendationType("author")
    } catch (error) {
      console.error("[v0] Error fetching author recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch author recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/books">
                <Button variant="ghost">Books</Button>
              </Link>
              <Link href="/loans">
                <Button variant="ghost">Loans</Button>
              </Link>
              <Link href="/recommendations">
                <Button variant="default">Recommendations</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Book Recommendations</h2>
          <p className="text-muted-foreground">Discover books based on authors and recent publications</p>
        </div>

        {/* Search Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Random Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => fetchRandomRecommendations(6)} className="w-full">
                Get Random Books
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recent Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchRecentRecommendations} className="w-full">
                Get Recent Books
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4" />
                By Author
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input
                  placeholder="Enter author name"
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchByAuthor(searchAuthor)
                    }
                  }}
                />
                <Button onClick={() => fetchByAuthor(searchAuthor)} className="w-full" variant="secondary">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {recommendationType === "random" && "Random Recommendations"}
                  {recommendationType === "recent" && "Recent Publications"}
                  {recommendationType === "author" && `Books by Author`}
                </CardTitle>
                <CardDescription>
                  {recommendations.length} book{recommendations.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading recommendations...</div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No recommendations available. Try a different search.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((book) => (
                  <Card key={book.id} className="hover:border-primary transition-colors">
                    <CardContent className="pt-6">
                      <div className="mb-3">
                        <h4 className="font-semibold text-foreground mb-2 text-balance leading-relaxed">
                          {book.title}
                        </h4>
                        {book.authorName && <p className="text-sm text-muted-foreground mb-1">by {book.authorName}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {book.publicationYear}
                          </Badge>
                          <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
