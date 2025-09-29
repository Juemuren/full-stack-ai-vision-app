import { useState, useEffect } from 'react';
import './App.css';

import { fetchModels, predictImage } from './api/predict';

import UploadSection from './components/UploadSection';
import PreviewSection from './components/PreviewSection';
import ResultSection from './components/ResultSection';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [predictObjectsNum, setPredictObjectsNum] = useState(0);
  const [predictDetails, setPredictDetails] = useState([]);

  useEffect(() => {
    fetchModels().then((models) => {
      setModels(models);
      if (models.length > 0) setSelectedModel(models[0].id);
    });
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDownloadUrl(null);
      setPredictObjectsNum(0);
      setPredictDetails([]);
    }
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handlePredict = async () => {
    if (!selectedFile || !selectedModel) return;
    setIsProcessing(true);
    try {
      const result = await predictImage(selectedFile, selectedModel);
      setPredictObjectsNum(result.predictObjectsNum);
      setPredictDetails(result.predictDetails);
      const url = URL.createObjectURL(result.imageBlob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Error:', error);
      alert('处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>图像识别</h1>
        <UploadSection
          onFileSelect={handleFileSelect}
          onPredict={handlePredict}
          onModelChange={handleModelChange}
          selectedFile={selectedFile}
          selectedModel={selectedModel}
          models={models}
          isProcessing={isProcessing}
        />
        <div className="image-row">
        <PreviewSection previewUrl={previewUrl} />
        <ResultSection
          downloadUrl={downloadUrl}
          predictObjectsNum={predictObjectsNum}
          predictDetails={predictDetails}
        />
        </div>
      </header>
    </div>
  );
}

export default App;
