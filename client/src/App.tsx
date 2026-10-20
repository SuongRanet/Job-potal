import { useState } from "react"
import Footer from "@/components/Footer"
import Header, { type View } from "@/components/Header"
import { useTheme } from "@/hooks/use-theme"
import CompaniesPage from "@/pages/CompaniesPage"
import JobsPage from "@/pages/JobsPage"

const App = () => {
  const { theme, toggle } = useTheme()
  const [view, setView] = useState<View>("jobs")
  const [initialQuery, setInitialQuery] = useState("")
  const [pageKey, setPageKey] = useState(0)

  // Remount JobsPage on navigation so filters reset (or start from a company name)
  const navigate = (next: View, query = "") => {
    setView(next)
    setInitialQuery(query)
    setPageKey((k) => k + 1)
  }

  return (
    <div className="min-h-svh">
      <Header theme={theme} onToggleTheme={toggle} view={view} onNavigate={navigate} />
      <main>
        {view === "jobs" ? (
          <JobsPage key={pageKey} initialQuery={initialQuery} />
        ) : (
          <CompaniesPage onSelect={(name) => navigate("jobs", name)} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
