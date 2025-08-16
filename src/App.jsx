import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import DocumentEditor from './components/DocumentEditor'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import { cn } from './lib/utils'

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/document/:id" element={<DocumentLayout />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

function DocumentLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [aiSidebarOpen, setAiSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen">
      {/* Main Sidebar */}
      <div className={cn(
        "transition-all duration-300 border-r bg-muted/20",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Document Editor */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          aiSidebarOpen ? "mr-80" : ""
        )}>
          <DocumentEditor 
            onToggleAiSidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
            aiSidebarOpen={aiSidebarOpen}
          />
        </div>

        {/* AI Sidebar */}
        <div className={cn(
          "absolute right-0 top-0 h-full w-80 bg-background border-l transform transition-transform duration-300 z-10",
          aiSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <AiSidebar onClose={() => setAiSidebarOpen(false)} />
        </div>
      </div>
    </div>
  )
}

function AiSidebar({ onClose }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">AI Assistant</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your intelligent writing companion is coming soon! This feature will help you:
              </p>
              <ul className="text-left text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Generate content suggestions
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Improve writing style
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Fix grammar and spelling
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Answer questions about your document
                </li>
              </ul>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              Feature Pending
            </div>
          </div>
        </div>

        {/* Chat Input (Disabled) */}
        <div className="border-t pt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask AI anything... (Coming Soon)"
              disabled
              className="w-full px-4 py-3 pr-12 border rounded-lg bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <button
              disabled
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App