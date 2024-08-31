import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextDiff from './components/TextDiff';
import FileInput from './components/FileInput';
import TextArea from './components/TextArea';

function App() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');

  return (
    <div className="App">
      <h1>Text Comparison Tool</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload or Paste Text 1</h2>
        <FileInput onFileLoad={setText1} />
        <TextArea value={text1} onChange={setText1} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload or Paste Text 2</h2>
        <FileInput onFileLoad={setText2} />
        <TextArea value={text2} onChange={setText2} />
      </div>
      <h2>Comparison Result</h2>
      <TextDiff text1={text1} text2={text2} />
    </div>
  );
}

export default App
