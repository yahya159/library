const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  bookService: `${API_BASE_URL}/book-service/api`,
  loanService: `${API_BASE_URL}/loan-service/api`,
  recommendationService: `${API_BASE_URL}/recommendation-service/api`,
}

export const API_ENDPOINTS = {
  books: {
    list: `${API_CONFIG.bookService}/books`,
    byId: (id: number) => `${API_CONFIG.bookService}/books/${id}`,
    create: `${API_CONFIG.bookService}/books`,
    update: (id: number) => `${API_CONFIG.bookService}/books/${id}`,
    delete: (id: number) => `${API_CONFIG.bookService}/books/${id}`,
  },
  authors: {
    list: `${API_CONFIG.bookService}/authors`,
    byId: (id: number) => `${API_CONFIG.bookService}/authors/${id}`,
    create: `${API_CONFIG.bookService}/authors`,
    update: (id: number) => `${API_CONFIG.bookService}/authors/${id}`,
    delete: (id: number) => `${API_CONFIG.bookService}/authors/${id}`,
  },
  loans: {
    list: `${API_CONFIG.loanService}/loans`,
    active: `${API_CONFIG.loanService}/loans/active`,
    byId: (id: number) => `${API_CONFIG.loanService}/loans/${id}`,
    create: `${API_CONFIG.loanService}/loans`,
    return: (id: number) => `${API_CONFIG.loanService}/loans/${id}/return`,
    delete: (id: number) => `${API_CONFIG.loanService}/loans/${id}`,
  },
  recommendations: {
    random: (count?: number) => `${API_CONFIG.recommendationService}/recommendations${count ? `?count=${count}` : ""}`,
    recent: `${API_CONFIG.recommendationService}/recommendations/recent`,
    byAuthor: (authorName: string) => `${API_CONFIG.recommendationService}/recommendations/author/${encodeURIComponent(authorName)}`,
  },
}
