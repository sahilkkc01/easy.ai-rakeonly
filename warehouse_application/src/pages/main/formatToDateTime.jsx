const formatToDateTime = (dateString) =>{
  if (!dateString) return ""; 
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}


const formatToDateTimeLocal = (dateString) => {
  if (!dateString) return ""; 
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const compressImage = (file, targetSize = 50 * 1024) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        let quality = 1;
        const scaleFactor = Math.sqrt(targetSize / file.size);
        
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compress = () => {
          canvas.toBlob(
            (blob) => {
              const fileExtension = "jpeg"; // Ensure the extension is correct
              const fileName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "compressed_image"; 
              const finalFileName = `${fileName}.${fileExtension}`;

              // Convert Blob to File with a proper name
              const compressedFile = new File([blob], finalFileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
        compress();
      };
    };
  });
};




export  {compressImage,formatToDateTime,formatToDateTimeLocal};