"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/Header"
import { API_ENDPOINTS } from "@/lib/api-config"

interface Author {
  id: number
  name: string
  nationality: string
}

interface Book {
  id: number
  title: string
  isbn: string
  publicationYear: number
  authorId: number
  authorName?: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const { toast } = useToast()

  const [bookForm, setBookForm] = useState({
    title: "",
    isbn: "",
    publicationYear: new Date().getFullYear(),
    authorId: "",
  })

  const [authorForm, setAuthorForm] = useState({
    name: "",
    nationality: "",
  })

  useEffect(() => {
    fetchBooks()
    fetchAuthors()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.books.list)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec du chargement des livres",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.authors.list)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setAuthors(data)
    } catch (error) {
      console.error("Erreur lors du chargement des auteurs:", error)
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBook ? API_ENDPOINTS.books.update(editingBook.id) : API_ENDPOINTS.books.create
      const method = editingBook ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookForm,
          authorId: Number.parseInt(bookForm.authorId),
        }),
      })

      if (response.ok) {
        toast({ title: "Succès", description: `Livre ${editingBook ? "modifié" : "créé"} avec succès` })
        setDialogOpen(false)
        resetBookForm()
        fetchBooks()
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast({ title: "Erreur", description: "Échec de l'enregistrement du livre", variant: "destructive" })
    }
  }

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAuthor ? API_ENDPOINTS.authors.update(editingAuthor.id) : API_ENDPOINTS.authors.create
      const method = editingAuthor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorForm),
      })

      if (response.ok) {
        toast({ title: "Succès", description: `Auteur ${editingAuthor ? "modifié" : "créé"} avec succès` })
        setAuthorDialogOpen(false)
        resetAuthorForm()
        fetchAuthors()
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast({ title: "Erreur", description: "Échec de l'enregistrement de l'auteur", variant: "destructive" })
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return
    try {
      const response = await fetch(API_ENDPOINTS.books.delete(id), { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Succès", description: "Livre supprimé avec succès" })
        fetchBooks()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast({ title: "Erreur", description: "Échec de la suppression du livre", variant: "destructive" })
    }
  }

  const handleDeleteAuthor = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet auteur ?")) return
    try {
      const response = await fetch(API_ENDPOINTS.authors.delete(id), { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Succès", description: "Auteur supprimé avec succès" })
        fetchAuthors()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast({ title: "Erreur", description: "Échec de la suppression de l'auteur", variant: "destructive" })
    }
  }

  const resetBookForm = () => {
    setBookForm({ title: "", isbn: "", publicationYear: new Date().getFullYear(), authorId: "" })
    setEditingBook(null)
  }

  const resetAuthorForm = () => {
    setAuthorForm({ name: "", nationality: "" })
    setEditingAuthor(null)
  }

  const openBookDialog = (book?: Book) => {
    if (book) {
      setBookForm({
        title: book.title,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        authorId: book.authorId.toString(),
      })
      setEditingBook(book)
    } else {
      resetBookForm()
    }
    setDialogOpen(true)
  }

  const openAuthorDialog = (author?: Author) => {
    if (author) {
      setAuthorForm({ name: author.name, nationality: author.nationality })
      setEditingAuthor(author)
    } else {
      resetAuthorForm()
    }
    setAuthorDialogOpen(true)
  }

  const getAuthorName = (authorId: number) => {
    const author = authors.find((a) => a.id === authorId)
    return author?.name || "Inconnu"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activePage="books" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-1">Livres & Auteurs</h2>
          <p className="text-sm text-muted-foreground">Gérez votre catalogue</p>
        </div>

        {/* Section Auteurs */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Auteurs</CardTitle>
                <CardDescription>Gérer les informations des auteurs</CardDescription>
              </div>
              <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openAuthorDialog()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAuthor ? "Modifier l'auteur" : "Ajouter un auteur"}</DialogTitle>
                    <DialogDescription>Entrez les détails de l'auteur</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAuthorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={authorForm.name}
                        onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationalité</Label>
                      <Input
                        id="nationality"
                        value={authorForm.nationality}
                        onChange={(e) => setAuthorForm({ ...authorForm, nationality: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">{editingAuthor ? "Modifier" : "Créer"}</Button>
                      <Button type="button" variant="outline" onClick={() => { setAuthorDialogOpen(false); resetAuthorForm() }}>Annuler</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {authors.map((author) => (
                <div key={author.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium text-sm">{author.name}</p>
                    <p className="text-xs text-muted-foreground">{author.nationality}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openAuthorDialog(author)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteAuthor(author.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Livres */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Livres</CardTitle>
                <CardDescription>Gérer votre catalogue de livres</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openBookDialog()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBook ? "Modifier le livre" : "Ajouter un livre"}</DialogTitle>
                    <DialogDescription>Entrez les détails du livre</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={bookForm.title}
                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        value={bookForm.isbn}
                        onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="publicationYear">Année</Label>
                      <Input
                        id="publicationYear"
                        type="number"
                        value={bookForm.publicationYear}
                        onChange={(e) => setBookForm({ ...bookForm, publicationYear: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorId">Auteur</Label>
                      <Select value={bookForm.authorId} onValueChange={(value) => setBookForm({ ...bookForm, authorId: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un auteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id.toString()}>{author.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">{editingBook ? "Modifier" : "Créer"}</Button>
                      <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetBookForm() }}>Annuler</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
            ) : books.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucun livre</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {books.map((book) => (
                  <div key={book.id} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{book.title}</h4>
                        <p className="text-xs text-muted-foreground">par {getAuthorName(book.authorId)}</p>
                        <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn} · {book.publicationYear}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button size="sm" variant="ghost" onClick={() => openBookDialog(book)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteBook(book.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
