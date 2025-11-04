import axios from 'axios';

export async function predictImages(file, modelIds) {
  const pridicts = modelIds.map(modelId => predictImage(file, modelId))
  const results = await Promise.all(pridicts)

  return results
}

export async function predictImage(file, modelId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', modelId);
  const response = await axios.post('http://localhost:8000/api/predict', formData, {
    responseType: 'blob',
  });
  // 解析自定义响应头
  const predictObjectsNum = JSON.parse(response.headers['x-predict-objects-num'] || '0');
  const predictDetails = JSON.parse(response.headers['x-predict-details'] || '[]');
  return {
    imageBlob: response.data,
    predictObjectsNum,
    predictDetails,
  };
}

export async function fetchModels() {
  const response = await axios.get('http://localhost:8000/api/models');
  return response.data.models || [];
}
