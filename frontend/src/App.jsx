import { useState, useEffect } from 'react';
import './App.css';

import { fetchModels, predictImages } from './api/predict';

import UploadSection from './components/UploadSection';
import PreviewSection from './components/PreviewSection';
import ResultSection from './components/ResultSection';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [models, setModels] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [predictObjectsNum, setPredictObjectsNum] = useState(0);
  const [predictDetails, setPredictDetails] = useState([]);

  useEffect(() => {
    fetchModels().then((models) => {
      setModels(models);
    });
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleClear()
    }
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value
    if (!selectedModels.includes(selectedModel)) {
      setSelectedModels(selectedModels.concat(selectedModel));
    }
  };

  const handlePredict = async () => {
    if (!selectedFile || selectedModels.length === 0) return;
    setIsProcessing(true);
    try {
      const results = await predictImages(selectedFile, selectedModels);

      const newUrls = []
      const newDetails = []
      let newObjectsCount = 0
      
      results.forEach(result => {
        newUrls.push(URL.createObjectURL(result.imageBlob))
        newDetails.push(result.predictDetails)
        newObjectsCount += result.predictObjectsNum
      });

      setDownloadUrls(newUrls)
      setPredictDetails(newDetails.flat())
      setPredictObjectsNum(newObjectsCount)

    } catch (error) {
      console.error('Error:', error);
      alert('处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearResults = () => {
    setDownloadUrls([])
    setPredictDetails([])
    setPredictObjectsNum(0)
  }

  const handleClearModels = () => {
    setSelectedModels([])
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>图像识别</h1>
        <UploadSection
          onFileSelect={handleFileSelect}
          onPredict={handlePredict}
          onModelChange={handleModelChange}
          onClear={handleClearResults}
          onReset={handleClearModels}
          selectedFile={selectedFile}
          selectedModel={selectedModels}
          models={models}
          isProcessing={isProcessing}
          isStarted={downloadUrls.length !== 0}
        />
        <div className="image-row">
          <PreviewSection previewUrl={previewUrl} />
          <ResultSection
            downloadUrls={downloadUrls}
            predictObjectsNum={predictObjectsNum}
            predictDetails={predictDetails}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
