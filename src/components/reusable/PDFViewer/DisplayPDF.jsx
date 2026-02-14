/* eslint-disable react-hooks/exhaustive-deps */
import { pdfCacheManager } from '@utils/pdf-cache-manager';
import { memo, useEffect, useRef, useState } from 'react';
import {
  FiChevronLeft as ChevronLeft,
  FiChevronRight as ChevronRight,
  FiFile as FileIcon,
  FiMaximize2 as MaximizeIcon,
  FiRotateCcw as RotateCcw,
  FiRotateCw as RotateCw,
  FiZoomIn as ZoomIn,
  FiZoomOut as ZoomOut,
} from 'react-icons/fi';
import PdfReusableButton from './PdfReusableButton';

const PDF_JS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDF_WORKER_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const CMAP_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/';

const DisplayPDF = ({
  pdfUrl,
  mode = 'preview',
  width,
  height,
  className = '',
  showOverlay = true,
  onClick = null,
  fallbackText = 'PDF Document',
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const minScale = 0.3;
  const maxScale = 3.0;
  const isPreviewMode = mode === 'preview';

  // Watch container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setContainerSize({ width: rect.width, height: rect.height });
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Load PDF.js
  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfJsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = PDF_JS_URL;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
      setPdfJsLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load PDF.js library');
    };
    document.head.appendChild(script);
  }, []);

  // Load PDF document with caching
  useEffect(() => {
    if (!pdfJsLoaded || !pdfUrl) return;

    const loadPDF = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = import.meta.env?.VITE_DIGITALOCEAN_SPACES_URL || '';
        const fullUrl = pdfUrl.startsWith('http')
          ? pdfUrl
          : `${baseUrl}${pdfUrl}`;

        if (pdfCacheManager.has(fullUrl)) {
          console.log('✅ Using cached PDF:', fullUrl);
          const cachedPdf = pdfCacheManager.get(fullUrl);
          setPdfDoc(cachedPdf);
          setTotalPages(cachedPdf.numPages);
          setCurrentPage(1);
          setLoading(false);
          return;
        }


        console.log('📥 Fetching new PDF:', fullUrl);
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: CMAP_URL,
          cMapPacked: true,
        }).promise;

        // Store in cache
        pdfCacheManager.set(fullUrl, pdf);

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('❌ PDF load error:', err);
        setError('Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfJsLoaded, pdfUrl]);


  // Render PDF page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask = null;
    const render = async () => {
      try {
        const page = await pdfDoc.getPage(isPreviewMode ? 1 : currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const baseViewport = page.getViewport({ scale: 1, rotation });

        let finalScale;

        const effectiveWidth = width || containerSize.width;
        const effectiveHeight = height || containerSize.height;

        if (isPreviewMode) {
          if (effectiveWidth && effectiveHeight) {
            const scaleX = effectiveWidth / baseViewport.width;
            const scaleY = effectiveHeight / baseViewport.height;
            finalScale = Math.min(scaleX, scaleY);
          } else {
            finalScale = 0.5;
          }
        } else {
          const userScale = Math.max(minScale, Math.min(maxScale, scale));

          if (effectiveWidth && effectiveHeight) {
            const scaledWidth = baseViewport.width * userScale;
            const scaledHeight = baseViewport.height * userScale;

            if (
              scaledWidth > effectiveWidth ||
              scaledHeight > effectiveHeight
            ) {
              const maxFitScale = Math.min(
                effectiveWidth / baseViewport.width,
                effectiveHeight / baseViewport.height,
              );
              finalScale = Math.min(userScale, maxFitScale);
            } else {
              finalScale = userScale;
            }
          } else {
            finalScale = userScale;
          }
        }

        const viewport = page.getViewport({ scale: finalScale, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
      } catch (err) {
        if (err?.name === 'RenderingCancelledException') {
          // Ignore cancel
        } else {
          console.error('❌ PDF render error:', err);
          setError('Failed to render PDF');
        }
      }
    };

    render();

    return () => {
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [
    pdfDoc,
    currentPage,
    scale,
    rotation,
    mode,
    containerSize,
    width,
    height,
  ]);

  // Drag functionality
  useEffect(() => {
    if (isPreviewMode) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      container.scrollBy(-dx, -dy);
      startX = e.clientX;
      startY = e.clientY;
    };

    const stopDragging = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.style.cursor = 'grab';
    canvas.style.cursor = 'grab';

    container.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [isPreviewMode, pdfDoc]);

  // Error state
  if (error) {
    if (isPreviewMode) {
      const containerStyle = {
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      };

      return (
        <div
          className={`flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
          style={containerStyle}
        >
          <FileIcon className="w-8 h-8 mb-2 text-gray-400" />
          <span className="px-2 text-xs text-center text-gray-500">
            {fallbackText}
          </span>
          <span className="px-2 mt-1 text-xs text-center text-red-500">
            {error}
          </span>
        </div>
      );
    }
    return <div className="text-sm text-red-500">{error}</div>;
  }

  // Loading state
  if (loading || !pdfDoc) {
    if (isPreviewMode) {
      const containerStyle = {
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      };

      return (
        <div
          className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
          style={containerStyle}
        >
          <div className="text-xs text-gray-500">Loading PDF...</div>
        </div>
      );
    }
    return <div className="text-sm text-gray-500">Loading PDF...</div>;
  }

  // Preview mode rendering
  if (isPreviewMode) {
    const containerStyle = {
      width: width ? `${width}px` : '100%',
      height: height ? `${height}px` : '100%',
    };

    return (
      <div
        className={`group relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={containerStyle}
        onClick={onClick}
      >
        <div
          className="flex items-center justify-center w-full h-full bg-white"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="object-contain max-w-full max-h-full"
          />
        </div>

        {showOverlay && onClick && (
          <div className="absolute inset-0 flex items-end transition-all duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-10">
            <div className="w-full p-2 transition-opacity duration-200 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1">
                  <MaximizeIcon className="w-3 h-3" />
                  <span>Click to view</span>
                </div>
                {totalPages > 0 && (
                  <span>
                    {totalPages} page{totalPages !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Viewer mode rendering
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      <div
        className="relative flex-1 min-h-0 overflow-auto border border-gray-300 rounded-md bg-gray-50 cursor-grab"
        ref={containerRef}
      >
        <div style={{ width: 'fit-content', height: 'fit-content' }}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 p-2 text-sm bg-white border-t bg-opacity-90 shadow-t">
        <div className="flex items-center gap-1">
          <PdfReusableButton
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            icon={ChevronLeft}
          />
          <span>
            {currentPage}/{totalPages}
          </span>
          <PdfReusableButton
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            icon={ChevronRight}
          />
        </div>
        <div className="flex gap-1">
          <PdfReusableButton
            onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
            icon={RotateCcw}
          />
          <PdfReusableButton
            onClick={() => setRotation((r) => (r + 90) % 360)}
            icon={RotateCw}
          />
        </div>
        <div className="flex items-center gap-1">
          <PdfReusableButton
            onClick={() => setScale((s) => Math.max(minScale, s - 0.2))}
            disabled={scale <= minScale}
            icon={ZoomOut}
          />
          <span className="text-center w-9">{Math.round(scale * 100)}%</span>
          <PdfReusableButton
            onClick={() => setScale((s) => Math.min(maxScale, s + 0.2))}
            disabled={scale >= maxScale}
            icon={ZoomIn}
          />
        </div>
      </div>
    </div>
  );
};

const areEqual = (prev, next) =>
  prev.pdfUrl === next.pdfUrl &&
  prev.mode === next.mode &&
  prev.width === next.width &&
  prev.height === next.height;

export default memo(DisplayPDF, areEqual);