const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Fetch configuration from backend
export async function getConfig() {
  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch configuration');
  }
  return response.json();
}

// Create a new send
export async function createSend(formData) {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create send');
  }

  return response.json();
}

// Get a send by hash (for files)
export async function getSend(hash, password = '') {
  let url = `${API_BASE_URL}/send/${hash}`;
  if (password) {
    url += `?password=${encodeURIComponent(password)}`;
  }

  const response = await fetch(url);

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve send');
  }

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // It's a file download
    const blob = await response.blob();
    const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
    return { file: blob, filename };
  }
}

// Get text send by hash (for text display)
export async function getTextSend(hash, password = '') {
  let url = `${API_BASE_URL}/text/${hash}`;
  if (password) {
    url += `?password=${encodeURIComponent(password)}`;
  }

  const response = await fetch(url);

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve text send');
  }

  // For text sends, we expect plain text response
  const text = await response.text();
  return { text };
}

// Check if a send requires a password
export async function checkPasswordProtection(hash) {
  const response = await fetch(`${API_BASE_URL}/send/${hash}/check`);

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    throw new Error('Failed to check password protection');
  }

  return response.json();
}