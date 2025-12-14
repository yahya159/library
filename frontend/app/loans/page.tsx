"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, RotateCcw, BookOpen, Calendar } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

const LOAN_API_URL = "http://localhost:8080/loan-service/api/loans"
const BOOK_API_URL = "http://localhost:8080/book-service/api/books"

interface Loan {
  id: number
  bookId: number
  borrowerName: string
  loanDate: string
  dueDate: string
  returnDate?: string
}

interface Book {
  id: number
  title: string
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showActive, setShowActive] = useState(false)
  const { toast } = useToast()

  const [loanForm, setLoanForm] = useState({
    bookId: "",
    borrowerName: "",
  })

  useEffect(() => {
    fetchLoans()
    fetchBooks()
  }, [showActive])

  const fetchLoans = async () => {
    try {
      const url = showActive ? `${LOAN_API_URL}/active` : LOAN_API_URL
      const response = await fetch(url)
      const data = await response.json()
      setLoans(data)
    } catch (error) {
      console.error("[v0] Error fetching loans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch loans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await fetch(BOOK_API_URL)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("[v0] Error fetching books:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(LOAN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: Number.parseInt(loanForm.bookId),
          borrowerName: loanForm.borrowerName,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Loan created successfully",
        })
        setDialogOpen(false)
        resetForm()
        fetchLoans()
      }
    } catch (error) {
      console.error("[v0] Error creating loan:", error)
      toast({
        title: "Error",
        description: "Failed to create loan",
        variant: "destructive",
      })
    }
  }

  const handleReturn = async (id: number) => {
    try {
      const response = await fetch(`${LOAN_API_URL}/${id}/return`, {
        method: "PUT",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Book returned successfully",
        })
        fetchLoans()
      }
    } catch (error) {
      console.error("[v0] Error returning book:", error)
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setLoanForm({
      bookId: "",
      borrowerName: "",
    })
  }

  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId)
    return book?.title || "Unknown Book"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate: string, returnDate?: string) => {
    if (returnDate) return false
    return new Date(dueDate) < new Date()
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
                <Button variant="default">Loans</Button>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Loan Management</h2>
            <p className="text-muted-foreground">Track book loans and manage returns</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Loans</CardTitle>
                <CardDescription>Manage book checkouts and returns</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant={showActive ? "default" : "outline"} onClick={() => setShowActive(!showActive)}>
                  {showActive ? "Show All" : "Show Active Only"}
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Loan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Loan</DialogTitle>
                      <DialogDescription>Enter the details for the new loan</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="bookId">Book</Label>
                        <Select
                          value={loanForm.bookId}
                          onValueChange={(value) => setLoanForm({ ...loanForm, bookId: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                          </SelectTrigger>
                          <SelectContent>
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>
                                {book.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="borrowerName">Borrower Name</Label>
                        <Input
                          id="borrowerName"
                          value={loanForm.borrowerName}
                          onChange={(e) => setLoanForm({ ...loanForm, borrowerName: e.target.value })}
                          placeholder="Enter borrower name"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Create Loan
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false)
                            resetForm()
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading loans...</div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No loans available. Create your first loan!</div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => (
                  <Card key={loan.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground text-balance">{getBookTitle(loan.bookId)}</h4>
                            {loan.returnDate ? (
                              <Badge variant="outline" className="bg-muted">
                                Returned
                              </Badge>
                            ) : isOverdue(loan.dueDate) ? (
                              <Badge variant="destructive">Overdue</Badge>
                            ) : (
                              <Badge className="bg-primary">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Borrower: {loan.borrowerName}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Loaned: {formatDate(loan.loanDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {formatDate(loan.dueDate)}</span>
                            </div>
                            {loan.returnDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Returned: {formatDate(loan.returnDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {!loan.returnDate && (
                          <Button size="sm" variant="outline" onClick={() => handleReturn(loan.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Return Book
                          </Button>
                        )}
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
