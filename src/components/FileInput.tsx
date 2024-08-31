import React from 'react';

interface FileInputProps {
  onFileLoad: (content: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileLoad }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileLoad(event.target.result.toString());
        }
      };
      reader.readAsText(file);
    }
  };

  return <input type="file" accept=".txt" onChange={handleFileChange} />;
};

export default FileInput;
