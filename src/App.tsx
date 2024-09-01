import React, { useState, useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextDiff from './components/TextDiff';
import FileInput from './components/FileInput';
import TextArea from './components/TextArea';



interface TextInputProps {
  title: string;
  text: string;
  setText: (text: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  onFileLoad: (content: string, fileName: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ title, text, setText, setFileName, onFileLoad }) => {

  const handleFileLoad = useCallback((content: string, fileName: string) => {
    setText(content);
    setFileName(fileName);
    onFileLoad(content, fileName);
  }, [setText, setFileName, onFileLoad]);

  return (
    <Card className="w-full bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="paste">
              <FileText className="mr-2 h-4 w-4" />
              Paste
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <FileInput
              onFileLoad={handleFileLoad}
              acceptedFileTypes={['.txt', '.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.py']}
              maxFileSizeMB={2}
            />
          </TabsContent>
          <TabsContent value="paste">
            <TextArea
              value={text}
              onChange={setText}
              placeholder="Start typing or paste your text here..."
              minRows={5}
              showLineNumbers={true}
              wrap={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

function App() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [fileName1, setFileName1] = useState<string>('File 1');
  const [fileName2, setFileName2] = useState<string>('File 2');

  const handleFile1Load = useCallback((content: string, fileName: string) => {
    setText1(content);
    setFileName1(fileName);
  }, []);

  const handleFile2Load = useCallback((content: string, fileName: string) => {
    setText2(content);
    setFileName2(fileName);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Check The Diff</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <TextInput
          title="Text 1"
          text={text1}
          setText={setText1}
          fileName={fileName1}
          setFileName={setFileName1}
          onFileLoad={handleFile1Load}
        />
        <TextInput
          title="Text 2"
          text={text2}
          setText={setText2}
          fileName={fileName2}
          setFileName={setFileName2}
          onFileLoad={handleFile2Load}
        />
      </div>

      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">Diff Result</CardTitle>
        </CardHeader>
        <CardContent>
          <TextDiff text1={text1} text2={text2} fileName1={fileName1} fileName2={fileName2} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;