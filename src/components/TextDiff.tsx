import React from 'react';
import { diffChars, Change } from 'diff';

interface TextDiffProps {
  text1: string;
  text2: string;
}

const TextDiff: React.FC<TextDiffProps> = ({ text1, text2 }) => {
  const diffs: Change[] = diffChars(text1, text2);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', whiteSpace: 'pre-wrap' }}>
        {diffs.map((part, index) => (
          <span
            key={index}
            style={{
              backgroundColor: part.added
                ? 'lightgreen'
                : part.removed
                ? 'salmon'
                : 'transparent',
              textDecoration: part.removed ? 'line-through' : 'none',
            }}
          >
            {part.value}
          </span>
        ))}
      </div>
      <div style={{ width: '50%', whiteSpace: 'pre-wrap' }}>
        {diffs.map((part, index) => (
          <span
            key={index}
            style={{
              backgroundColor: part.added
                ? 'lightgreen'
                : part.removed
                ? 'salmon'
                : 'transparent',
            }}
          >
            {part.added ? part.value : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextDiff;
