import { useState } from 'react'
import './App.css'
import TextDiff from './components/TextDiff';
import FileInput from './components/FileInput';
import TextArea from './components/TextArea';

function App() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [fileName1, setFileName1] = useState<string>('File 1');
  const [fileName2, setFileName2] = useState<string>('File 2');

  const handleFile1Load = (content: string, fileName: string) => {
    setText1(content);
    setFileName1(fileName);
  };

  const handleFile2Load = (content: string, fileName: string) => {
    setText2(content);
    setFileName2(fileName);
  };

  return (
    <div className="App">
      <h1>Text Comparison Tool</h1>
      
      {/* Side-by-Side File Inputs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h2>Upload or Paste Text 1</h2>
          <FileInput onFileLoad={(content) => handleFile1Load(content, 'File 1')} />
          <TextArea value={text1} onChange={setText1} />
        </div>
        <div>
          <h2>Upload or Paste Text 2</h2>
          <FileInput onFileLoad={(content) => handleFile2Load(content, 'File 2')} />
          <TextArea value={text2} onChange={setText2} />
        </div>
      </div>

      <h2>Comparison Result</h2>
      <TextDiff text1={text1} text2={text2} fileName1={fileName1} fileName2={fileName2} />
    </div>
  );
}

export default App
