import Link from "next/link"
import { BookOpen } from "lucide-react"

interface HeaderProps {
  activePage?: "books" | "loans" | "recommendations"
}

export function Header({ activePage }: HeaderProps) {
  const navItems = [
    { href: "/books", label: "Livres", key: "books" as const },
    { href: "/loans", label: "Emprunts", key: "loans" as const },
    { href: "/recommendations", label: "Recommandations", key: "recommendations" as const },
  ]

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Bibliothèque</h1>
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  activePage === item.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
