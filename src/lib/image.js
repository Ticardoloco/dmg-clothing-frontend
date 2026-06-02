/**
 * Uploads an image buffer to the /api/uploadimage endpoint.
 * @param {Buffer|Blob|File} fileBuffer - The image data to upload.
 * @param {string} filename - The name of the file (e.g., 'avatar.jpg').
 * @param {string} mimeType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns {Promise<Object>} The JSON response from the server.
 */
export async function uploadImage(fileBuffer, filename, mimeType) {
  try {
    const formData = new FormData();
    
    // If you are in a Node.js environment that doesn't natively support 
    // passing a raw Buffer into FormData, we convert it to a Blob.
    const blob = new Blob([fileBuffer], { type: mimeType });
    
    // 'image' is the field name your backend API will look for
    formData.append('image', blob, filename);

    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
      // Note: Do NOT set the 'Content-Type' header manually. 
      // Fetch will automatically set it to 'multipart/form-data' with the correct boundary.
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadImage lib:', error);
    throw error;
  }
}