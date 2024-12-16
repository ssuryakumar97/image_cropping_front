import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper() {
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExternalUrl = () => {
    if (externalUrl) {
      setImageSrc(externalUrl);
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const aspect = 16 / 9; // Example: Crop to 16:9 aspect ratio

    setCrop(
      centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspect,
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      )
    );
  };

  const handleCropComplete = useCallback((crop) => {
    setCompletedCrop(crop);
  }, []);

  const generateCroppedImage = useCallback(() => {
    if (!completedCrop || !imageRef.current || !previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const image = imageRef.current;
    console.log(image.naturalHeight)
    console.log(image.naturalWidth)
    console.log(image.width)
    console.log(image.height)
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setCroppedImage(previewUrl);
        }
      },
      "image/png",
      1
    );
  }, [completedCrop]);

  return (
    <div>
      <h1>Image Cropper</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div>
        <input
          type="text"
          placeholder="Enter external image URL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
        />
        <button onClick={handleExternalUrl}>Load Image</button>
      </div>
      {imageSrc && (
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={handleCropComplete}
          aspect={16 / 9} // Optional: Lock aspect ratio
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source"
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        </ReactCrop>
      )}
      <div>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: completedCrop ? completedCrop.width : 0,
            height: completedCrop ? completedCrop.height : 0,
            display: "none",
          }}
        />
      </div>
      <button onClick={generateCroppedImage}>Generate Cropped Image</button>
      {croppedImage && (
        <div>
          <h2>Cropped Image Preview:</h2>
          <img src={croppedImage} alt="Cropped Preview" />
        </div>
      )}
    </div>
  );
}

export default ImageCropper;
