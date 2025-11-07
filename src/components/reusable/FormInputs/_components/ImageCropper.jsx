import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import React, { useCallback, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
   return centerCrop(
      makeAspectCrop(
         {
            unit: '%',
            width: 90,
         },
         aspect || 1,
         mediaWidth,
         mediaHeight
      ),
      mediaWidth,
      mediaHeight
   );
};

const ImageCropper = ({
   isOpen,
   onClose,
   imageSrc,
   onCropComplete,
   cropShape = 'rectangular',
   title = 'Crop Image',
   aspectRatio,
   outputFormat = 'webp',
   maxWidth = 1920,
   maxHeight = 1080,
   compressionQuality = 0.7,
   enableResize = true,
}) => {
   const [crop, setCrop] = useState();
   const [completedCrop, setCompletedCrop] = useState();
   const [scale, setScale] = useState(1);
   const [rotate, setRotate] = useState(0);
   const [isProcessing, setIsProcessing] = useState(false);
   const [processingProgress, setProcessingProgress] = useState('');
   const [originalFileSize, setOriginalFileSize] = useState(0);

   const imgRef = useRef(null);
   const previewCanvasRef = useRef(null);

   // Determine aspect ratio based on crop shape
   const finalAspectRatio = cropShape === 'circular' ? 1 : aspectRatio;

   const onImageLoad = useCallback(
      (e) => {
         const { width, height } = e.currentTarget;
         setCrop(centerAspectCrop(width, height, finalAspectRatio));
         const estimatedSize = width * height * 3;
         setOriginalFileSize(estimatedSize);
      },
      [finalAspectRatio]
   );

   useDebounceEffect(
      async () => {
         if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
         ) {
            canvasPreview(
               imgRef.current,
               previewCanvasRef.current,
               completedCrop,
               scale,
               rotate
            );
         }
      },
      100,
      [completedCrop, scale, rotate]
   );

   // Enhanced processing with proper compression
   const handleCropConfirm = async () => {
      const image = imgRef.current;
      const previewCanvas = previewCanvasRef.current;

      if (!image || !previewCanvas || !completedCrop) {
         console.error('Missing required elements for cropping');
         return;
      }

      setIsProcessing(true);
      setProcessingProgress('Analyzing image...');

      try {
         // Calculate the scale factors
         const scaleX = image.naturalWidth / image.width;
         const scaleY = image.naturalHeight / image.height;

         // Get original crop dimensions
         const originalCropX = completedCrop.x * scaleX;
         const originalCropY = completedCrop.y * scaleY;
         const originalCropWidth = completedCrop.width * scaleX;
         const originalCropHeight = completedCrop.height * scaleY;

         setProcessingProgress('Calculating optimal dimensions...');

         // Apply intelligent resizing (following App.tsx logic)
         let finalWidth = originalCropWidth;
         let finalHeight = originalCropHeight;

         if (
            enableResize &&
            (finalWidth > maxWidth || finalHeight > maxHeight)
         ) {
            const ratio = Math.min(
               maxWidth / finalWidth,
               maxHeight / finalHeight
            );
            finalWidth = Math.floor(finalWidth * ratio);
            finalHeight = Math.floor(finalHeight * ratio);
         }

         setProcessingProgress('Creating optimized canvas...');

         // Create main processing canvas
         const finalCanvas = document.createElement('canvas');
         const finalCtx = finalCanvas.getContext('2d');

         if (!finalCtx) {
            throw new Error('No 2d context available');
         }

         finalCanvas.width = finalWidth;
         finalCanvas.height = finalHeight;

         // CRITICAL: Apply the same high-quality settings as App.tsx
         finalCtx.imageSmoothingEnabled = true;
         finalCtx.imageSmoothingQuality = 'high';

         // CRITICAL: Fill with white background (essential for compression)
         finalCtx.fillStyle = '#FFFFFF';
         finalCtx.fillRect(0, 0, finalWidth, finalHeight);

         setProcessingProgress('Processing transformations...');

         finalCtx.save();

         // Apply circular clipping if needed
         if (cropShape === 'circular') {
            const centerX = finalWidth / 2;
            const centerY = finalHeight / 2;
            const radius = Math.min(finalWidth, finalHeight) / 2;

            finalCtx.beginPath();
            finalCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            finalCtx.clip();
         }

         // Apply transformations if any
         if (scale !== 1 || rotate !== 0) {
            const centerX = finalWidth / 2;
            const centerY = finalHeight / 2;

            finalCtx.translate(centerX, centerY);
            if (rotate !== 0) {
               finalCtx.rotate((rotate * Math.PI) / 180);
            }
            if (scale !== 1) {
               finalCtx.scale(scale, scale);
            }
            finalCtx.translate(-centerX, -centerY);
         }

         // Draw the cropped portion with high quality
         finalCtx.drawImage(
            image,
            originalCropX,
            originalCropY,
            originalCropWidth,
            originalCropHeight, // source crop
            0,
            0,
            finalWidth,
            finalHeight // destination size
         );

         finalCtx.restore();

         setProcessingProgress(
            `Compressing to ${outputFormat.toUpperCase()}...`
         );

         // Create compressed blob using the same method as App.tsx
         const compressionPromise = new Promise((resolve, reject) => {
            finalCanvas.toBlob(
               (blob) => {
                  if (!blob) {
                     reject(new Error('Failed to create compressed blob'));
                     return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                     const dataUrl = reader.result;

                     // Calculate compression ratio
                     const compressionRatio =
                        originalFileSize > 0
                           ? ((originalFileSize - blob.size) /
                                originalFileSize) *
                             100
                           : 0;

                     // Create file from blob
                     const fileName = `cropped_compressed_${Date.now()}.${outputFormat}`;
                     const file = new File([blob], fileName, {
                        type: blob.type,
                     });

                     const result = {
                        file,
                        dataUrl,
                        dimensions: { width: finalWidth, height: finalHeight },
                        fileSize: blob.size,
                        quality: compressionQuality,
                        originalSize: originalFileSize,
                        compressionRatio: Math.max(0, compressionRatio),
                        format: outputFormat.toUpperCase(),
                     };

                     resolve(result);
                  };

                  reader.onerror = () => {
                     reject(new Error('Failed to read compressed image'));
                  };

                  reader.readAsDataURL(blob);
               },
               `image/${outputFormat}`,
               compressionQuality
            );
         });

         setProcessingProgress('Finalizing...');

         const result = await compressionPromise;

         // Return the file to maintain compatibility
         onCropComplete(result.file);
         handleClose();
      } catch (error) {
         console.error('Error processing image:', error);
         alert(`Processing failed: ${error.message}`);
      } finally {
         setIsProcessing(false);
         setProcessingProgress('');
      }
   };

   const handleClose = () => {
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      setProcessingProgress('');
      setOriginalFileSize(0);
      onClose();
   };

   if (!isOpen) return null;

   return (
      <ModalWithContent
         isOpen={isOpen}
         setIsOpen={onClose}
         title={title}
         padding={false}
         content={
            <div className="w-full max-w-4xl max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
               {/* Crop Area */}
               <div
                  className="flex-1 overflow-auto"
                  style={{ maxHeight: 'calc(80vh - 160px)' }}
               >
                  <div className="flex items-center justify-center p-4">
                     {imageSrc && (
                        <ReactCrop
                           crop={crop}
                           onChange={(_, percentCrop) => setCrop(percentCrop)}
                           onComplete={(c) => setCompletedCrop(c)}
                           aspect={finalAspectRatio}
                           minHeight={100}
                           circularCrop={cropShape === 'circular'}
                           className="max-w-full"
                        >
                           <img
                              ref={imgRef}
                              alt="Crop preview"
                              src={imageSrc}
                              style={{
                                 transform: `scale(${scale}) rotate(${rotate}deg)`,
                                 maxWidth: '100%',
                                 height: 'auto',
                              }}
                              onLoad={onImageLoad}
                           />
                        </ReactCrop>
                     )}
                  </div>
               </div>

               {/* Hidden preview canvas */}
               <canvas
                  ref={previewCanvasRef}
                  style={{
                     position: 'absolute',
                     top: '-9999px',
                     left: '-9999px',
                  }}
               />

               {/* Controls */}
               <div className="flex items-center justify-center gap-8 px-4 py-3 border-t border-gray-200 bg-gray-50">
                  {/* Scale Control */}
                  <div className="flex items-center gap-2 min-w-[180px] text-sm">
                     <label
                        htmlFor="scale-range"
                        className="font-medium text-gray-700"
                     >
                        Zoom:
                     </label>
                     <input
                        id="scale-range"
                        type="range"
                        min={0.9}
                        max={3}
                        step={0.01}
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        disabled={isProcessing}
                        className="w-40 cursor-pointer accent-primary"
                     />
                     <span className="w-10 text-gray-600">
                        {(scale * 100).toFixed(0)}%
                     </span>
                  </div>

                  {/* Rotate Control */}
                  <div className="flex items-center gap-2 min-w-[180px] text-sm">
                     <label
                        htmlFor="rotate-range"
                        className="font-medium text-gray-700"
                     >
                        Rotate:
                     </label>
                     <input
                        id="rotate-range"
                        type="range"
                        min={0}
                        max={180}
                        step={1}
                        value={rotate}
                        onChange={(e) => setRotate(Number(e.target.value))}
                        disabled={isProcessing}
                        className="w-40 cursor-pointer accent-primary"
                     />
                     <span className="w-10 text-gray-600">{rotate}°</span>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                  <button
                     onClick={handleClose}
                     className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                     disabled={isProcessing}
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleCropConfirm}
                     className="px-6 py-2 text-sm font-medium text-white transition-colors bg-primary rounded-md hover:bg-primary_light focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[160px] duration-300"
                     disabled={!completedCrop || isProcessing}
                  >
                     {isProcessing ? processingProgress : 'Save'}
                  </button>
               </div>
            </div>
         }
      />
   );
};

export default React.memo(ImageCropper);
