"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, BookOpen, User } from "lucide-react"
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
import Link from "next/link"

const API_BASE_URL = "http://localhost:8080/book-service/api"

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
      const response = await fetch(`${API_BASE_URL}/books`)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("[v0] Error fetching books:", error)
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/authors`)
      const data = await response.json()
      setAuthors(data)
    } catch (error) {
      console.error("[v0] Error fetching authors:", error)
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBook ? `${API_BASE_URL}/books/${editingBook.id}` : `${API_BASE_URL}/books`
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
        toast({
          title: "Success",
          description: `Book ${editingBook ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetBookForm()
        fetchBooks()
      }
    } catch (error) {
      console.error("[v0] Error saving book:", error)
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      })
    }
  }

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAuthor ? `${API_BASE_URL}/authors/${editingAuthor.id}` : `${API_BASE_URL}/authors`
      const method = editingAuthor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorForm),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Author ${editingAuthor ? "updated" : "created"} successfully`,
        })
        setAuthorDialogOpen(false)
        resetAuthorForm()
        fetchAuthors()
      }
    } catch (error) {
      console.error("[v0] Error saving author:", error)
      toast({
        title: "Error",
        description: "Failed to save author",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Book deleted successfully",
        })
        fetchBooks()
      }
    } catch (error) {
      console.error("[v0] Error deleting book:", error)
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAuthor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Author deleted successfully",
        })
        fetchAuthors()
      }
    } catch (error) {
      console.error("[v0] Error deleting author:", error)
      toast({
        title: "Error",
        description: "Failed to delete author",
        variant: "destructive",
      })
    }
  }

  const resetBookForm = () => {
    setBookForm({
      title: "",
      isbn: "",
      publicationYear: new Date().getFullYear(),
      authorId: "",
    })
    setEditingBook(null)
  }

  const resetAuthorForm = () => {
    setAuthorForm({
      name: "",
      nationality: "",
    })
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
      setAuthorForm({
        name: author.name,
        nationality: author.nationality,
      })
      setEditingAuthor(author)
    } else {
      resetAuthorForm()
    }
    setAuthorDialogOpen(true)
  }

  const getAuthorName = (authorId: number) => {
    const author = authors.find((a) => a.id === authorId)
    return author?.name || "Unknown Author"
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
                <Button variant="default">Books</Button>
              </Link>
              <Link href="/loans">
                <Button variant="ghost">Loans</Button>
              </Link>
              <Link href="/recommendations">
                <Button variant="ghost">Recommendations</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Books & Authors</h2>
            <p className="text-muted-foreground">Manage your book catalog and author information</p>
          </div>
        </div>

        {/* Authors Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Authors
                </CardTitle>
                <CardDescription>Manage author information</CardDescription>
              </div>
              <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openAuthorDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Author
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAuthor ? "Edit Author" : "Add New Author"}</DialogTitle>
                    <DialogDescription>
                      {editingAuthor ? "Update the author information" : "Enter the details for the new author"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAuthorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={authorForm.name}
                        onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={authorForm.nationality}
                        onChange={(e) => setAuthorForm({ ...authorForm, nationality: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingAuthor ? "Update" : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setAuthorDialogOpen(false)
                          resetAuthorForm()
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors.map((author) => (
                <Card key={author.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{author.name}</h4>
                        <p className="text-sm text-muted-foreground">{author.nationality}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openAuthorDialog(author)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAuthor(author.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Books Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Books
                </CardTitle>
                <CardDescription>Manage your book catalog</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openBookDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
                    <DialogDescription>
                      {editingBook ? "Update the book information" : "Enter the details for the new book"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
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
                      <Label htmlFor="publicationYear">Publication Year</Label>
                      <Input
                        id="publicationYear"
                        type="number"
                        value={bookForm.publicationYear}
                        onChange={(e) => setBookForm({ ...bookForm, publicationYear: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorId">Author</Label>
                      <Select
                        value={bookForm.authorId}
                        onValueChange={(value) => setBookForm({ ...bookForm, authorId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id.toString()}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingBook ? "Update" : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false)
                          resetBookForm()
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading books...</div>
            ) : books.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No books available. Add your first book!</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1 text-balance">{book.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">by {getAuthorName(book.authorId)}</p>
                          <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                          <p className="text-xs text-muted-foreground">Published: {book.publicationYear}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openBookDialog(book)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteBook(book.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
