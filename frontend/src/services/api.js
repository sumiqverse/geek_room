const API_BASE_URL = 'http://localhost:8000/api';

export const analyzeVideo = async (file, sector) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('sector', sector);

  const response = await fetch(`${API_BASE_URL}/analyze/video`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to analyze video');
  }

  return response.json();
};

export const analyzeImages = async (files, sector) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }
  formData.append('sector', sector);

  const response = await fetch(`${API_BASE_URL}/analyze/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to analyze images');
  }

  return response.json();
};
