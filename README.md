# Library Management System - Frontend

A modern React frontend for managing books, loans, and recommendations in a library system.

## Features

- **Books Management**: Create, read, update, and delete books and authors
- **Loan Tracking**: Manage book loans with due dates and return tracking
- **Recommendations**: Browse recommended books and search by author
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback on all CRUD operations

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8080`
- The backend should have the following services running:
  - API Gateway (port 8080)
  - Book Service (port 8081)
  - Loan Service (port 8082)
  - Recommendation Service (port 8083)

## Installation

1. Install dependencies (auto-managed by v0/Next.js)
2. The project will automatically install required packages on first run

## Running the Application

The application runs on `http://localhost:3000` by default.

### Development Mode

Open the preview in v0 or deploy to Vercel for instant hosting.

## API Configuration

The frontend connects to your backend API at `http://localhost:8080`. If your API runs on a different URL, update the `API_BASE_URL` constant in each page file:

- `app/books/page.tsx`
- `app/loans/page.tsx`
- `app/recommendations/page.tsx`

\`\`\`typescript
const API_BASE_URL = 'http://your-api-url:port'
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── books/          # Books and authors management
│   ├── loans/          # Loan tracking and returns
│   ├── recommendations/# Book recommendations
│   ├── globals.css     # Global styles and theme
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/
│   └── ui/            # Reusable UI components
└── README.md
\`\`\`

## API Endpoints Used

### Books Service
- `GET /books` - List all books
- `POST /books` - Create a book
- `PUT /books/{id}` - Update a book
- `DELETE /books/{id}` - Delete a book
- `GET /authors` - List all authors
- `POST /authors` - Create an author
- `PUT /authors/{id}` - Update an author
- `DELETE /authors/{id}` - Delete an author

### Loan Service
- `GET /loans` - List all loans
- `POST /loans` - Create a loan
- `POST /loans/{id}/return` - Return a book

### Recommendation Service
- `GET /recommendations/random` - Get random book
- `GET /recommendations/recent` - Get recent publications
- `GET /recommendations/by-author?name={name}` - Search by author

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components

## Troubleshooting

**CORS Errors**: Make sure your backend API has CORS enabled for `http://localhost:3000`

**Connection Refused**: Verify that all backend services are running on their respective ports

**404 Errors**: Check that your API Gateway is correctly routing requests to the microservices

## License

MIT
