
const useDocumentStore = create(
  persist(
    (set, get) => ({
      // Documents state
      documents: [
        {
          id: '1',
          title: 'Welcome to Powered Document Editor',
          content: [
            {
              id: 'block-1',
              type: 'heading1',
              content: 'Welcome to Powered Document Editor',
              metadata: {}
            },
            {
              id: 'block-2',
              type: 'paragraph',
              content: 'This is a Notion-like document editor with AI assistance. Start typing to create your first document.',
              metadata: {}
            },
            {
              id: 'block-3',
              type: 'paragraph',
              content: 'Use "/" to open the block menu and add different types of content.',
              metadata: {}
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
          tags: ['welcome', 'getting-started']
        }
      ],
      
      // Current document state
      currentDocument: null,
      isLoading: false,
      error: null,
      
      // AI sidebar state
      aiSidebarOpen: false,
      aiHistory: [],
      
      // Editor state
      selectedBlocks: [],
      isEditing: false,
      
      // Actions
      createDocument: (title = 'Untitled') => {
        const newDoc = {
          id: `doc-${Date.now()}`,
          title,
          content: [
            {
              id: `block-${Date.now()}`,
              type: 'paragraph',
              content: '',
              metadata: {}
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
          tags: []
        }
        
        set(state => ({
          documents: [newDoc, ...state.documents],
          currentDocument: newDoc
        }))
        
        return newDoc
      },
      
      updateDocument: (documentId, updates) => {
        set(state => ({
          documents: state.documents.map(doc => 
            doc.id === documentId 
              ? { 
                  ...doc, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                }
              : doc
          ),
          currentDocument: state.currentDocument?.id === documentId 
            ? { ...state.currentDocument, ...updates, updatedAt: new Date().toISOString() }
            : state.currentDocument
        }))
      },
      
      deleteDocument: (documentId) => {
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== documentId),
          currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument
        }))
      },
      
      duplicateDocument: (documentId) => {
        const document = get().documents.find(doc => doc.id === documentId)
        if (!document) return
        
        const duplicatedDoc = {
          ...document,
          id: `doc-${Date.now()}`,
          title: `${document.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: document.content.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }))
        }
        
        set(state => ({
          documents: [duplicatedDoc, ...state.documents]
        }))
        
        return duplicatedDoc
      },
      
      setCurrentDocument: (document) => {
        set({ currentDocument: document })
      },
      
      // Block operations
      addBlock: (documentId, afterBlockId = null, blockType = 'paragraph') => {
        const newBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: blockType,
          content: '',
          metadata: {}
        }
        
        set(state => {
          const document = state.documents.find(doc => doc.id === documentId)
          if (!document) return state
          
          let newContent
          if (afterBlockId) {
            const insertIndex = document.content.findIndex(block => block.id === afterBlockId)
            newContent = [
              ...document.content.slice(0, insertIndex + 1),
              newBlock,
              ...document.content.slice(insertIndex + 1)
            ]
          } else {
            newContent = [...document.content, newBlock]
          }
          
          const updatedDoc = {
            ...document,
            content: newContent,
            updatedAt: new Date().toISOString()
          }
          
          return {
            documents: state.documents.map(doc => 
              doc.id === documentId ? updatedDoc : doc
            ),
            currentDocument: state.currentDocument?.id === documentId ? updatedDoc : state.currentDocument
          }
        })
        
        return newBlock
      },
      
      updateBlock: (documentId, blockId, updates) => {
        set(state => {
          const document = state.documents.find(doc => doc.id === documentId)
          if (!document) return state
          
          const updatedContent = document.content.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          )
          
          const updatedDoc = {
            ...document,
            content: updatedContent,
            updatedAt: new Date().toISOString()
          }
          
          return {
            documents: state.documents.map(doc => 
              doc.id === documentId ? updatedDoc : doc
            ),
            currentDocument: state.currentDocument?.id === documentId ? updatedDoc : state.currentDocument
          }
        })
      },
      
      deleteBlock: (documentId, blockId) => {
        set(state => {
          const document = state.documents.find(doc => doc.id === documentId)
          if (!document || document.content.length <= 1) return state
          
          const updatedContent = document.content.filter(block => block.id !== blockId)
          const updatedDoc = {
            ...document,
            content: updatedContent,
            updatedAt: new Date().toISOString()
          }
          
          return {
            documents: state.documents.map(doc => 
              doc.id === documentId ? updatedDoc : doc
            ),
            currentDocument: state.currentDocument?.id === documentId ? updatedDoc : state.currentDocument
          }
        })
      },
      
      moveBlock: (documentId, blockId, direction) => {
        set(state => {
          const document = state.documents.find(doc => doc.id === documentId)
          if (!document) return state
          
          const blockIndex = document.content.findIndex(block => block.id === blockId)
          if (blockIndex === -1) return state
          
          const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1
          if (newIndex < 0 || newIndex >= document.content.length) return state
          
          const newContent = [...document.content]
          const [movedBlock] = newContent.splice(blockIndex, 1)
          newContent.splice(newIndex, 0, movedBlock)
          
          const updatedDoc = {
            ...document,
            content: newContent,
            updatedAt: new Date().toISOString()
          }
          
          return {
            documents: state.documents.map(doc => 
              doc.id === documentId ? updatedDoc : doc
            ),
            currentDocument: state.currentDocument?.id === documentId ? updatedDoc : state.currentDocument
          }
        })
      },
      
      // AI sidebar actions
      toggleAISidebar: () => {
        set(state => ({ aiSidebarOpen: !state.aiSidebarOpen }))
      },
      
      setAISidebarOpen: (open) => {
        set({ aiSidebarOpen: open })
      },
      
      addAIMessage: (message) => {
        set(state => ({
          aiHistory: [...state.aiHistory, {
            id: `msg-${Date.now()}`,
            ...message,
            timestamp: new Date().toISOString()
          }]
        }))
      },
      
      clearAIHistory: () => {
        set({ aiHistory: [] })
      },
      
      // Selection and editing
      setSelectedBlocks: (blockIds) => {
        set({ selectedBlocks: Array.isArray(blockIds) ? blockIds : [blockIds] })
      },
      
      clearSelection: () => {
        set({ selectedBlocks: [] })
      },
      
      setIsEditing: (editing) => {
        set({ isEditing: editing })
      },
      
      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setError: (error) => {
        set({ error })
      },
      
      clearError: () => {
        set({ error: null })
      },
      
      // Search and filter
      searchDocuments: (query) => {
        const { documents } = get()
        if (!query.trim()) return documents
        
        return documents.filter(doc => 
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.content.some(block => 
            block.content.toLowerCase().includes(query.toLowerCase())
          ) ||
          doc.tags.some(tag => 
            tag.toLowerCase().includes(query.toLowerCase())
          )
        )
      },
      
      getDocumentsByTag: (tag) => {
        const { documents } = get()
        return documents.filter(doc => doc.tags.includes(tag))
      },
      
      getAllTags: () => {
        const { documents } = get()
        const allTags = documents.flatMap(doc => doc.tags)
        return [...new Set(allTags)].sort()
      }
    }),
    {
      name: 'document-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        documents: state.documents,
        aiHistory: state.aiHistory
      })
    }
  )
)

export default useDocumentStore