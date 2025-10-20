import React, { useCallback, useEffect, useRef, useState } from 'react';

function SignatureCanvas({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const getCoordinates = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      setIsDrawing(true);
      setHasSignature(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const coords = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const coords = getCoordinates(e, canvas);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    },
    [isDrawing, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      onSignatureChange(dataURL);
    }
  }, [isDrawing, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange('');
  }, [onSignatureChange]);

  return (
    <div>
      <div className="signature-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="signature-canvas"
          style={{ touchAction: 'none' }}
        />
        {!hasSignature && (
          <div className="signature-placeholder">
            Click and drag to sign here
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={clearSignature}
          className="clear-signature-btn"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}

export default SignatureCanvas;
