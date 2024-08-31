import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      style={{ width: '100%', fontFamily: 'monospace' }}
    />
  );
};

export default TextArea;
