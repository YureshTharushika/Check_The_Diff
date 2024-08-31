import React, { useMemo } from 'react';
import { diffLines, Change } from 'diff';
import './TextDiff.css'

interface TextDiffProps {
  text1: string;
  text2: string;
  fileName1: string;
  fileName2: string;
}

const TextDiff: React.FC<TextDiffProps> = ({ text1, text2, fileName1, fileName2 }) => {
  const diffs = useMemo(() => diffLines(text1, text2, { newlineIsToken: true }), [text1, text2]);

  const renderDiff = (diffs: Change[]) => {
    return diffs.map((part, index) => {
      const isAdded = part.added;
      const isRemoved = part.removed;
      const className = isAdded ? 'diff-added' : isRemoved ? 'diff-removed' : 'diff-unchanged';

      return (
        <div key={index} className={`diff-line ${className}`}>
          {part.value.split('\n').map((line, lineIndex) => (
            <div key={`${index}-${lineIndex}`}>{line}</div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="text-diff">
      <div className="file-names">
        <div><strong>{fileName1}</strong></div>
        <div><strong>{fileName2}</strong></div>
      </div>
      <div className="diff-container">
        <div className="diff-column original">
          {text1.split('\n').map((line, index) => (
            <div key={index} className="diff-line">{line}</div>
          ))}
        </div>
        <div className="diff-column modified">
          {renderDiff(diffs)}
        </div>
      </div>
    </div>
  );
};

export default TextDiff;