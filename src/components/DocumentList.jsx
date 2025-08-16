import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  FolderOpen,
  Star,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

const DocumentList = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'Getting Started',
      content: 'Welcome to your AI-powered document editor...',
      lastModified: new Date('2024-01-15'),
      starred: true,
      emoji: '👋'
    },
    {
      id: '2',
      title: 'Project Notes',
      content: 'Important project details and requirements...',
      lastModified: new Date('2024-01-14'),
      starred: false,
      emoji: '📝'
    },
    {
      id: '3',
      title: 'Meeting Minutes',
      content: 'Team meeting notes from January 12th...',
      lastModified: new Date('2024-01-12'),
      starred: true,
      emoji: '🤝'
    },
    {
      id: '4',
      title: 'Ideas & Brainstorm',
      content: 'Random thoughts and creative ideas...',
      lastModified: new Date('2024-01-10'),
      starred: false,
      emoji: '💡'
    }
  ]);
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'document' && pathParts[2]) {
      setSelectedDocId(pathParts[2]);
    } else {
      setSelectedDocId(null);
    }
  }, [location]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (docId) => {
    navigate(`/document/${docId}`);
  };

  const handleNewDocument = () => {
    const newId = Date.now().toString();
    const newDoc = {
      id: newId,
      title: 'Untitled',
      content: '',
      lastModified: new Date(),
      starred: false,
      emoji: '📄'
    };
    setDocuments(prev => [newDoc, ...prev]);
    navigate(`/document/${newId}`);
  };

  const toggleStar = (docId, e) => {
    e.stopPropagation();
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, starred: !doc.starred } : doc
      )
    );
  };

  const deleteDocument = (docId, e) => {
    e.stopPropagation();
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    if (selectedDocId === docId) {
      navigate('/');
    }
  };

  const formatLastModified = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 border-r border-gray-200", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
          <button
            onClick={handleNewDocument}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            title="New Document"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.length === 0 ? (
          <div className="p-6 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNewDocument}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Create your first document
              </button>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc.id)}
                className={cn(
                  "group relative px-4 py-3 cursor-pointer border-l-2 transition-all duration-150",
                  selectedDocId === doc.id
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent hover:bg-gray-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{doc.emoji}</span>
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {doc.title}
                      </h3>
                      {doc.starred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {doc.content || 'No content yet...'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatLastModified(doc.lastModified)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleStar(doc.id, e)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={doc.starred ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={cn(
                        "w-3 h-3",
                        doc.starred ? "text-yellow-500 fill-current" : "text-gray-400"
                      )} />
                    </button>
                    <button
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors text-gray-400"
                      title="Delete document"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;