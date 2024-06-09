// const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`;

// console.log('Cloudinary Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
// console.log('Cloudinary Upload Preset:', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);


// const uploadFile = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // use env variable

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("File upload failed");
//     }

//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// };

// export default uploadFile;
