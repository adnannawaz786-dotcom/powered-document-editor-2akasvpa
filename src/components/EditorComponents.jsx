import React, { useState, useRef, useEffect } from 'react';
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
  Link,
  Image,
  Type,
  Heading1,
  Heading2,
  Heading3,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  Move
} from 'lucide-react';
import { cn } from '../lib/utils';

// Block Types
export const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING_1: 'heading1',
  HEADING_2: 'heading2',
  HEADING_3: 'heading3',
  BULLET_LIST: 'bulletList',
  NUMBERED_LIST: 'numberedList',
  QUOTE: 'quote',
  CODE: 'code',
  IMAGE: 'image'
};

// Toolbar Component
export const EditorToolbar = ({ onFormat, activeFormats = [], className }) => {
  const toolbarItems = [
    { icon: Bold, action: 'bold', tooltip: 'Bold' },
    { icon: Italic, action: 'italic', tooltip: 'Italic' },
    { icon: Underline, action: 'underline', tooltip: 'Underline' },
    { type: 'separator' },
    { icon: Heading1, action: 'heading1', tooltip: 'Heading 1' },
    { icon: Heading2, action: 'heading2', tooltip: 'Heading 2' },
    { icon: Heading3, action: 'heading3', tooltip: 'Heading 3' },
    { type: 'separator' },
    { icon: AlignLeft, action: 'alignLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, action: 'alignCenter', tooltip: 'Align Center' },
    { icon: AlignRight, action: 'alignRight', tooltip: 'Align Right' },
    { type: 'separator' },
    { icon: List, action: 'bulletList', tooltip: 'Bullet List' },
    { icon: ListOrdered, action: 'numberedList', tooltip: 'Numbered List' },
    { icon: Quote, action: 'quote', tooltip: 'Quote' },
    { icon: Code, action: 'code', tooltip: 'Code Block' },
    { type: 'separator' },
    { icon: Link, action: 'link', tooltip: 'Add Link' },
    { icon: Image, action: 'image', tooltip: 'Add Image' }
  ];

  return (
    <div className={cn(
      "flex items-center gap-1 p-2 border-b border-gray-200 bg-white sticky top-0 z-10",
      className
    )}>
      {toolbarItems.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
          );
        }

        const Icon = item.icon;
        const isActive = activeFormats.includes(item.action);

        return (
          <button
            key={item.action}
            onClick={() => onFormat(item.action)}
            className={cn(
              "p-2 rounded hover:bg-gray-100 transition-colors",
              isActive && "bg-gray-200 text-blue-600"
            )}
            title={item.tooltip}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

// Block Menu Component
export const BlockMenu = ({ isOpen, onClose, onSelect, position }) => {
  const menuRef = useRef(null);

  const blockTypes = [
    { type: BLOCK_TYPES.PARAGRAPH, icon: Type, label: 'Text', description: 'Just start writing with plain text.' },
    { type: BLOCK_TYPES.HEADING_1, icon: Heading1, label: 'Heading 1', description: 'Big section heading.' },
    { type: BLOCK_TYPES.HEADING_2, icon: Heading2, label: 'Heading 2', description: 'Medium section heading.' },
    { type: BLOCK_TYPES.HEADING_3, icon: Heading3, label: 'Heading 3', description: 'Small section heading.' },
    { type: BLOCK_TYPES.BULLET_LIST, icon: List, label: 'Bulleted list', description: 'Create a simple bulleted list.' },
    { type: BLOCK_TYPES.NUMBERED_LIST, icon: ListOrdered, label: 'Numbered list', description: 'Create a list with numbering.' },
    { type: BLOCK_TYPES.QUOTE, icon: Quote, label: 'Quote', description: 'Capture a quote.' },
    { type: BLOCK_TYPES.CODE, icon: Code, label: 'Code', description: 'Capture a code snippet.' },
    { type: BLOCK_TYPES.IMAGE, icon: Image, label: 'Image', description: 'Upload or embed with a link.' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
      style={{ 
        left: position?.x || 0, 
        top: position?.y || 0 
      }}
    >
      <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
        Basic blocks
      </div>
      {blockTypes.map((block) => {
        const Icon = block.icon;
        return (
          <button
            key={block.type}
            onClick={() => {
              onSelect(block.type);
              onClose();
            }}
            className="w-full px-3 py-2 flex items-start gap-3 hover:bg-gray-50 text-left"
          >
            <Icon className="w-5 h-5 mt-0.5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">{block.label}</div>
              <div className="text-sm text-gray-500">{block.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// Block Actions Component
export const BlockActions = ({ isVisible, onAction, position }) => {
  const actionsRef = useRef(null);

  const actions = [
    { icon: Plus, action: 'add', tooltip: 'Add block below' },
    { icon: Copy, action: 'duplicate', tooltip: 'Duplicate block' },
    { icon: Move, action: 'move', tooltip: 'Move block' },
    { icon: Trash2, action: 'delete', tooltip: 'Delete block', danger: true }
  ];

  if (!isVisible) return null;

  return (
    <div
      ref={actionsRef}
      className="absolute z-40 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
      style={{ 
        left: position?.x || 0, 
        top: position?.y || 0 
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.action}
            onClick={() => onAction(action.action)}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 transition-colors",
              action.danger && "hover:bg-red-50 hover:text-red-600"
            )}
            title={action.tooltip}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

// Editable Block Component
export const EditableBlock = ({ 
  block, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onKeyDown,
  onShowBlockMenu,
  onShowActions,
  className 
}) => {
  const blockRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleInput = (e) => {
    onUpdate(block.id, { content: e.target.textContent });
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) {
      onKeyDown(e, block);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getBlockElement = () => {
    const commonProps = {
      ref: blockRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      onClick: () => onSelect(block.id),
      className: cn(
        "outline-none focus:outline-none min-h-[1.5rem]",
        isSelected && "ring-2 ring-blue-200 rounded",
        className
      ),
      dangerouslySetInnerHTML: { __html: block.content || '' }
    };

    switch (block.type) {
      case BLOCK_TYPES.HEADING_1:
        return <h1 {...commonProps} className={cn(commonProps.className, "text-3xl font-bold")} />;
      case BLOCK_TYPES.HEADING_2:
        return <h2 {...commonProps} className={cn(commonProps.className, "text-2xl font-bold")} />;
      case BLOCK_TYPES.HEADING_3:
        return <h3 {...commonProps} className={cn(commonProps.className, "text-xl font-bold")} />;
      case BLOCK_TYPES.QUOTE:
        return (
          <blockquote {...commonProps} className={cn(
            commonProps.className, 
            "border-l-4 border-gray-300 pl-4 italic text-gray-600"
          )} />
        );
      case BLOCK_TYPES.CODE:
        return (
          <pre {...commonProps} className={cn(
            commonProps.className,
            "bg-gray-100 rounded p-3 font-mono text-sm overflow-x-auto"
          )} />
        );
      default:
        return <p {...commonProps} />;
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Plus button for adding blocks */}
      {isHovered && (
        <button
          onClick={(e) => onShowBlockMenu(e, block.id)}
          className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {/* More actions button */}
      {isHovered && (
        <button
          onClick={(e) => onShowActions(e, block.id)}
          className="absolute -left-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {getBlockElement()}
    </div>
  );
};

// Document Title Component
export const DocumentTitle = ({ title, onUpdate, className }) => {
  const titleRef = useRef(null);

  const handleInput = (e) => {
    onUpdate(e.target.textContent);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  return (
    <h1
      ref={titleRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-4xl font-bold outline-none focus:outline-none text-gray-900 mb-4",
        "empty:before:content-['Untitled'] empty:before:text-gray-400",
        className
      )}
      dangerouslySetInnerHTML={{ __html: title || '' }}
    />
  );
};