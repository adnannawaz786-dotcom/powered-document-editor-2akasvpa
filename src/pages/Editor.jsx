import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Plus,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2
} from 'lucide-react'
import { cn } from '../lib/utils'

const Editor = () => {
  const { id } = useParams()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('Untitled Document')
  const [isSaving, setIsSaving] = useState(false)
  const [showAISidebar, setShowAISidebar] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const editorRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    // Simulate loading document data
    if (id) {
      setTitle(`Document ${id}`)
      setContent('<p>Start writing your document...</p>')
    }
  }, [id])

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertBlock = (type) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    
    let element
    switch (type) {
      case 'h1':
        element = document.createElement('h1')
        element.textContent = 'Heading 1'
        element.className = 'text-3xl font-bold mb-4'
        break
      case 'h2':
        element = document.createElement('h2')
        element.textContent = 'Heading 2'
        element.className = 'text-2xl font-semibold mb-3'
        break
      case 'h3':
        element = document.createElement('h3')
        element.textContent = 'Heading 3'
        element.className = 'text-xl font-medium mb-2'
        break
      case 'quote':
        element = document.createElement('blockquote')
        element.textContent = 'Quote'
        element.className = 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4'
        break
      case 'code':
        element = document.createElement('pre')
        element.innerHTML = '<code>Code block</code>'
        element.className = 'bg-gray-100 rounded p-4 font-mono text-sm my-4'
        break
      default:
        element = document.createElement('p')
        element.textContent = 'New paragraph'
        break
    }
    
    range.insertNode(element)
    selection.removeAllRanges()
    editorRef.current?.focus()
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleAISubmit = (e) => {
    e.preventDefault()
    // AI functionality placeholder
    console.log('AI Query:', aiQuery)
    setAiQuery('')
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main Editor Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        showAISidebar ? "mr-80" : ""
      )}>
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none flex-1"
              placeholder="Untitled"
            />
            <div className="flex items-center gap-2">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
              <span className="text-sm text-gray-500">
                {isSaving ? 'Saving...' : 'Saved'}
              </span>
              <button
                onClick={() => setShowAISidebar(!showAISidebar)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  showAISidebar 
                    ? "bg-blue-100 text-blue-600" 
                    : "hover:bg-gray-100 text-gray-600"
                )}
                title="Toggle AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 flex-wrap">
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
              <button
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-gray-200">
              <button
                onClick={() => insertBlock('h1')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertBlock('h2')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertBlock('h3')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-gray-200">
              <button
                onClick={() => formatText('justifyLeft')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('justifyCenter')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('justifyRight')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 px-2">
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('insertOrderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertBlock('quote')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertBlock('code')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div
              ref={editorRef}
              contentEditable
              className="min-h-full outline-none prose prose-lg max-w-none"
              style={{ lineHeight: '1.6' }}
              onInput={(e) => setContent(e.target.innerHTML)}
              onKeyUp={handleSave}
              suppressContentEditableWarning={true}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      {showAISidebar && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 border-l border-gray-200 flex flex-col shadow-lg">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAISidebar(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Ask AI to help with your document
            </p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">AI Assistant</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Hello! I'm here to help you with your document. You can ask me to:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Improve your writing</li>
                      <li>• Generate content</li>
                      <li>• Fix grammar and style</li>
                      <li>• Summarize sections</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Feature Pending</p>
                    <p className="text-sm text-amber-700 mt-1">
                      AI functionality is currently under development. This interface shows how it will work once implemented.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleAISubmit} className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled
              />
              <button
                type="submit"
                disabled
                className="p-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                title="Feature pending"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              AI features coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor