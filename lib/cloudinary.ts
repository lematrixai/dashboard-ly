// Client-side Cloudinary configuration
// We only use the upload API, not the full SDK to avoid Node.js dependencies

// Helper function to upload media to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string = 'posts'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    
    console.log('Cloudinary upload config:', {
      cloudName,
      uploadPreset,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log('Uploading to:', uploadUrl);

    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        console.log('Cloudinary response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Cloudinary response data:', data);
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`));
        }
      })
      .catch(error => {
        console.error('Cloudinary upload error:', error);
        reject(error);
      });
  });
};

// Helper function to delete media from Cloudinary (server-side only)
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // This function would be used in server actions
  // For now, we'll just log the deletion
  console.log('Would delete from Cloudinary:', publicId);
}; 