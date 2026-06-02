import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 1. Convert file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Wrap Cloudinary's upload_stream in a Promise to handle async/await
    const cloudinaryUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'user_uploads', 
            resource_type: 'auto',   
          },
          (error, result) => {
            if (error) {
              // Capture the full Cloudinary rejection object
              return reject(error);
            }
            resolve(result); 
          }
        );
        
        // Write the buffer to the stream and end it
        stream.end(buffer);
      });
    };

    // 3. Execute the upload
    const uploadResult = await cloudinaryUpload();

    // 4. Return the secure URL provided by Cloudinary
    return NextResponse.json({ 
      success: true, 
      imageUrl: uploadResult.secure_url, 
      publicId: uploadResult.public_id
    });

  } catch (error) {
    // CRUCIAL: Log to terminal AND send the exact error message back to the UI
    console.error('Cloudinary upload error:', error);
    
    return NextResponse.json({ 
      error: 'Upload to Cloudinary failed',
      message: error.message || 'Unknown internal error',
      debugDetails: error // This exposes the exact error object (like missing API keys)
    }, { status: 500 });
  }
}