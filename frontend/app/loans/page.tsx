"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, RotateCcw } from "lucide-react"
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
      const url = showActive ? API_ENDPOINTS.loans.active : API_ENDPOINTS.loans.list
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setLoans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erreur lors du chargement des emprunts:", error)
      setLoans([])
      toast({
        title: "Erreur",
        description: `Échec du chargement des emprunts: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.books.list)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const data = await response.json()
      setBooks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error)
      setBooks([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const bookIdNum = Number.parseInt(loanForm.bookId)
    if (isNaN(bookIdNum)) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un livre valide", variant: "destructive" })
      return
    }
    if (!loanForm.borrowerName.trim()) {
      toast({ title: "Erreur", description: "Le nom de l'emprunteur est requis", variant: "destructive" })
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.loans.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: bookIdNum, borrowerName: loanForm.borrowerName.trim() }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Échec de la création de l'emprunt")
      }

      toast({ title: "Succès", description: "Emprunt créé avec succès" })
      setDialogOpen(false)
      resetForm()
      fetchLoans()
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast({ title: "Erreur", description: error instanceof Error ? error.message : "Échec de la création", variant: "destructive" })
    }
  }

  const handleReturn = async (id: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.loans.return(id), { method: "PUT" })
      if (response.ok) {
        toast({ title: "Succès", description: "Livre retourné avec succès" })
        fetchLoans()
      }
    } catch (error) {
      console.error("Erreur lors du retour:", error)
      toast({ title: "Erreur", description: "Échec du retour du livre", variant: "destructive" })
    }
  }

  const resetForm = () => setLoanForm({ bookId: "", borrowerName: "" })
  const getBookTitle = (bookId: number) => books.find((b) => b.id === bookId)?.title || "Inconnu"
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
  const isOverdue = (dueDate: string, returnDate?: string) => !returnDate && new Date(dueDate) < new Date()

  const getStatus = (loan: Loan) => {
    if (loan.returnDate) return { label: "Retourné", className: "text-muted-foreground" }
    if (isOverdue(loan.dueDate)) return { label: "En retard", className: "text-destructive" }
    return { label: "Actif", className: "text-foreground" }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activePage="loans" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-1">Emprunts</h2>
          <p className="text-sm text-muted-foreground">Suivez les emprunts et les retours</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Registre des emprunts</CardTitle>
                <CardDescription>Gérer les emprunts de livres</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={showActive ? "default" : "outline"} onClick={() => setShowActive(!showActive)}>
                  {showActive ? "Tous" : "Actifs"}
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Nouveau
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer un emprunt</DialogTitle>
                      <DialogDescription>Entrez les détails de l'emprunt</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="bookId">Livre</Label>
                        <Select value={loanForm.bookId} onValueChange={(value) => setLoanForm({ ...loanForm, bookId: value })} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un livre" />
                          </SelectTrigger>
                          <SelectContent>
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>{book.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="borrowerName">Emprunteur</Label>
                        <Input
                          id="borrowerName"
                          value={loanForm.borrowerName}
                          onChange={(e) => setLoanForm({ ...loanForm, borrowerName: e.target.value })}
                          placeholder="Nom"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Créer</Button>
                        <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Annuler</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucun emprunt</div>
            ) : (
              <div className="space-y-2">
                {loans.map((loan) => {
                  const status = getStatus(loan)
                  return (
                    <div key={loan.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{getBookTitle(loan.bookId)}</span>
                          <span className={`text-xs ${status.className}`}>· {status.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {loan.borrowerName} · {formatDate(loan.loanDate)} → {formatDate(loan.dueDate)}
                          {loan.returnDate && ` · Retourné le ${formatDate(loan.returnDate)}`}
                        </p>
                      </div>
                      {!loan.returnDate && (
                        <Button size="sm" variant="outline" onClick={() => handleReturn(loan.id)}>
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Retourner
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
