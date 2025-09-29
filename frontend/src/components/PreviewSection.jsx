function ImagePreview({ previewUrl }) {
  if (!previewUrl) return null;
  return (
    <div className="preview-section">
      <h3>原图预览</h3>
      <div className="image-container">
        <img src={previewUrl} alt="原图预览" className="preview-image" />
      </div>
    </div>
  );
}

export default ImagePreview;
