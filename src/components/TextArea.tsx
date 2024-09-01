import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TextArea.css'

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  showLineNumbers?: boolean;
  wrap?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = 'Enter your text here...',
  minRows = 5,
  maxRows = 20000,
  showLineNumbers = true,
  wrap = false,
}) => {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;
      const scrollHeight = textarea.scrollHeight;
      
      textarea.style.height = `${Math.max(minHeight, Math.min(scrollHeight, maxHeight))}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setUndoStack([...undoStack, value]);
    setRedoStack([]);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      // Set cursor position after tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'y') {
        e.preventDefault();
        redo();
      }
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousValue = undoStack[undoStack.length - 1];
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([value, ...redoStack]);
      onChange(previousValue);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextValue = redoStack[0];
      setRedoStack(redoStack.slice(1));
      setUndoStack([...undoStack, value]);
      onChange(nextValue);
    }
  };

  const getStats = useCallback(() => {
    const charCount = value.length;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    const lineCount = value.split('\n').length;
    return { charCount, wordCount, lineCount };
  }, [value]);

  const { charCount, wordCount, lineCount } = getStats();

  return (
    <div className="advanced-textarea-container">
      <div className="textarea-wrapper" style={{ flexDirection: wrap ? 'column' : 'row' }}>
        {showLineNumbers && (
          <div className="line-numbers">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="line-number">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="advanced-textarea"
          style={{ width: wrap ? '100%' : `${Math.max(value.length * 8, 300)}px` }}
          wrap={wrap ? 'soft' : 'off'}
        />
      </div>
      <div className="stats">
        Characters: {charCount} | Words: {wordCount} | Lines: {lineCount}
      </div>
    </div>
  );
};

export default TextArea;