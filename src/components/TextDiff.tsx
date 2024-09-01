import React, { useMemo, useRef, useEffect, useState } from 'react';
import { diffLines, diffChars } from 'diff';
import './TextDiff.css'

interface TextDiffProps {
  text1: string;
  text2: string;
  fileName1: string;
  fileName2: string;
}

const TextDiff: React.FC<TextDiffProps> = ({ text1, text2, fileName1, fileName2 }) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const diffs = useMemo(() => {
    // Ensure both texts end with a newline
    const processedText1 = text1.endsWith('\n') ? text1 : text1 + '\n';
    const processedText2 = text2.endsWith('\n') ? text2 : text2 + '\n';
    return diffLines(processedText1, processedText2, { newlineIsToken: true });
  }, [text1, text2]);
  
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (leftRef.current && rightRef.current) {
        if (target === leftRef.current) {
          rightRef.current.scrollTop = target.scrollTop;
        } else if (target === rightRef.current) {
          leftRef.current.scrollTop = target.scrollTop;
        }
      }
    };

    leftRef.current?.addEventListener('scroll', syncScroll);
    rightRef.current?.addEventListener('scroll', syncScroll);

    return () => {
      leftRef.current?.removeEventListener('scroll', syncScroll);
      rightRef.current?.removeEventListener('scroll', syncScroll);
    };
  }, []);

  const toggleCollapse = (index: number) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderInlineChanges = (oldStr: string, newStr: string) => {
    const charDiffs = diffChars(oldStr, newStr);
    return charDiffs.map((part, index) => {
      const className = part.added ? 'char-added' : part.removed ? 'char-removed' : '';
      return <span key={index} className={className}>{part.value}</span>;
    });
  };

  const renderDiff = () => {
    let leftLineNumber = 1;
    let rightLineNumber = 1;
    const gutterChanges: ('added' | 'removed' | 'modified')[] = [];

    const renderedDiffs = diffs.map((part, index) => {
      const lines = part.value.split('\n');
      // Remove last empty line only if it's an empty string
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }
      
      const isAdded = part.added;
      const isRemoved = part.removed;

      if (isAdded) gutterChanges.push('added');
      else if (isRemoved) gutterChanges.push('removed');
      else gutterChanges.push('modified');

      const isCollapsed = collapsedSections.has(index);

      const diffLines = lines.map((line, lineIndex) => {
        const leftNumber = isAdded ? null : leftLineNumber++;
        const rightNumber = isRemoved ? null : rightLineNumber++;

        return (
          <div key={`${index}-${lineIndex}`} className={`diff-line ${isAdded ? 'added' : isRemoved ? 'removed' : ''}`}>
            <span className="line-number left">{leftNumber}</span>
            <span className="line-number right">{rightNumber}</span>
            <span className="line-content">
              {isAdded || isRemoved ? line : renderInlineChanges(line, lines[lineIndex])}
            </span>
          </div>
        );
      });

      return (
        <div key={index} className="diff-section">
          {lines.length > 1 && (
            <div className="collapse-control" onClick={() => toggleCollapse(index)}>
              {isCollapsed ? '+ ' : '- '}
              {lines.length} {isAdded ? 'added' : isRemoved ? 'removed' : 'modified'} lines
            </div>
          )}
          {!isCollapsed && diffLines}
        </div>
      );
    });

    return { renderedDiffs, gutterChanges };
  };

  const { renderedDiffs, gutterChanges } = renderDiff();

  return (
    <div className="text-diff">
      <div className="file-names">
        <div><strong>{fileName1}</strong></div>
        <div><strong>{fileName2}</strong></div>
      </div>
      <div className="diff-container">
        <div className="gutter">
          {gutterChanges.map((change, index) => (
            <div key={index} className={`gutter-cell ${change}`} />
          ))}
        </div>
        <div className="diff-content" ref={leftRef}>
          {renderedDiffs}
        </div>
      </div>
    </div>
  );
};

export default TextDiff;