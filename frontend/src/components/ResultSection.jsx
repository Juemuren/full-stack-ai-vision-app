function ResultSection({ downloadUrl, predictObjectsNum, predictDetails }) {
  if (!downloadUrl) return null;
  return (
    <div className="result-section">
      <h3>识别结果</h3>
      <div className="image-container">
        <img src={downloadUrl} alt="检测结果" className="result-image" />
      </div>
      <a
        href={downloadUrl}
        download="result.jpg"
        className="download-btn"
      >
        下载结果图片
      </a>
      <details className="detection-details">
        <summary>识别到 {predictObjectsNum} 个物体</summary>
        <ul>
          {predictDetails.map((item, index) => (
            <li key={index}>
              物体: {item.class}, 置信度: {(item.confidence * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default ResultSection;
