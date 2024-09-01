import React, { useState, useRef, useCallback } from 'react';
import './FileInput.css'
import UploadIcon from '../assets/upload.svg';

interface FileInputProps {
  onFileLoad: (content: string, fileName: string) => void;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
}

const FileInput: React.FC<FileInputProps> = ({
  onFileLoad,
  acceptedFileTypes = ['.txt', '.html', '.css', '.js', '.json', '.md'],
  maxFileSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFileName(null);
    setError(null);
    setUploadProgress(null);
  };

  const validateFile = (file: File): string | null => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `Invalid file type. Accepted types are: ${acceptedFileTypes.join(', ')}`;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return `File size exceeds the limit of ${maxFileSizeMB}MB`;
    }
    return null;
  };

  const normalizeLineEndings = (content: string): string => {
    // Replace all occurrences of \r\n (Windows) or \r (Mac) with \n (Unix)
    return content.replace(/\r\n|\r/g, '\n');
  };

  const handleFileChange = useCallback((file: File) => {
    resetState();
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = normalizeLineEndings(event.target.result.toString());
        onFileLoad(content, file.name);
        setFileName(file.name);
        setUploadProgress(null);
      }
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  }, [acceptedFileTypes, maxFileSizeMB, onFileLoad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`file-input-container ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept={acceptedFileTypes.join(',')} 
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      {fileName ? (
        <div className="file-name">{fileName}</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : uploadProgress !== null ? (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      ) : (
        <div className="upload-prompt">
          <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
          <p>Drag & Drop your file here or click to browse</p>
          <p className="file-types">Accepted file types: {acceptedFileTypes.join(', ')}</p>
          <p className="file-size-limit">Max file size: {maxFileSizeMB}MB</p>
        </div>
      )}
    </div>
  );
};

export default FileInput;