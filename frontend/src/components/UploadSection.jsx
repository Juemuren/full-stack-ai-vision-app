function UploadSection({
  onFileSelect,
  onModelChange,
  onPredict,
  onClear,
  onReset,
  selectedFile,
  selectedModel,
  isProcessing,
  isStarted,
  models,
}) {
  const showDescription = () => {
    window.alert(models.find(m => m.id === selectedModel).description)
  }

  return (
    <div className="upload-section">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        disabled={isProcessing}
      />
      <label htmlFor="file-upload" className="upload-btn">
        {selectedFile ? '重新上传图片' : "上传图片"}
      </label>
      <select
        multiple
        className="model-select-btn"
        value={selectedModel}
        onChange={onModelChange}
        disabled={isProcessing || models.length === 0}
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <button onClick={onReset}>
        重置选项
      </button>
      {selectedFile && selectedModel && (
        <button
          onClick={onPredict}
          disabled={isProcessing}
          className="predict-btn"
        >
          {isProcessing ? '识别中' : '开始识别'}
        </button>
      )}
      {isStarted && (
        <button onClick={onClear} className="clear-btn">
          清除结果
        </button>
      )}
    </div>
  );
}

export default UploadSection;
