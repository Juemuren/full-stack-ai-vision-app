function ResultSection({ downloadUrls, predictObjectsNum, predictDetails }) {
  const countByClass = predictDetails.reduce((acc, curr) => {
    const name = curr.class
    const confidence = curr.confidence

    if (!acc[name]) {
      acc[name] = {
        count: 0,
        totalConfidence: 0,
      };
    }

    acc[name].count += 1;
    acc[name].totalConfidence += confidence;
    return acc
  }, {})

  if (downloadUrls.length === 0) return null;
  return (
    <div className="result-section">
      <h3>识别结果</h3>
      {downloadUrls.map((downloadUrl, i) => (
        <div key={i}>
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
        </div>
      ))}

      <details className="detection-details">
        <summary>识别到 {predictObjectsNum} 个物体</summary>
        <ul>
          {
            Object.entries(countByClass).map(([name, { count, totalConfidence }]) => (
              <li key={name}>
                <strong>{name}</strong>
                <p>数量: {count}</p>
                <p>平均置信度: {(totalConfidence * 100 / count).toFixed(3)}%</p>
              </li>
            ))
          }
        </ul>
      </details>
    </div>
  );
}

export default ResultSection;
