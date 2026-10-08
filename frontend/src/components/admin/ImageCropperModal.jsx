import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../lib/cropImage';

const ASPECT_RATIOS = [
  { label: '16:9 (Hero / Desglose)', value: 16 / 9 },
  { label: '21:9 (Panorámico)', value: 21 / 9 },
  { label: '4:3 (Estándar)', value: 4 / 3 },
  { label: '1:1 (Cuadrado)', value: 1 },
  { label: 'Libre', value: null },
];

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = 'cropped-image.jpg',
  title = 'Ajustar y Recortar Imagen',
  defaultAspect = 16 / 9,
  onCropConfirm,
  onUploadOriginal,
  onClose,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(defaultAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Reset state when opening with a new image or aspect
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setAspect(defaultAspect);
      setCroppedAreaPixels(null);
      setProcessing(false);
    }
  }, [isOpen, defaultAspect, imageSrc]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !processing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, processing, onClose]);

  const onCropComplete = useCallback((croppedArea, currentCroppedAreaPixels) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const safeName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
      const croppedFile = new File([croppedBlob], safeName, { type: 'image/jpeg' });
      await onCropConfirm(croppedBlob, croppedFile);
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Hubo un error al recortar la imagen. Intenta de nuevo.');
      setProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(defaultAspect);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#0f0f10] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">crop</span>
            <div>
              <h3 className="text-white font-mono font-bold text-sm tracking-wide uppercase">
                [ RECORTAR IMAGEN // CROP & ADJUST ]
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {title} &bull; Arrastra para encuadrar y ajusta el zoom
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={processing}
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Cerrar (Esc)"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="px-6 py-2.5 border-b border-white/5 bg-white/[0.02] flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-gray-400 uppercase text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">aspect_ratio</span> Proporción:
          </span>
          {ASPECT_RATIOS.map((item) => {
            const isActive = aspect === item.value || (item.value === null && aspect === null);
            return (
              <button
                key={item.label}
                type="button"
                disabled={processing}
                onClick={() => setAspect(item.value)}
                className={`px-3 py-1 rounded-md transition-all shrink-0 font-medium ${
                  isActive
                    ? 'bg-primary text-black font-bold shadow-sm shadow-primary/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Cropper Viewport */}
        <div className="relative w-full h-[380px] sm:h-[460px] bg-[#050505] overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            showGrid={true}
            style={{
              containerStyle: {
                backgroundColor: '#050505',
              },
              cropAreaStyle: {
                border: '2px solid #ccff00',
                boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.75)',
              },
            }}
          />

          {/* Guide badge */}
          <div className="absolute top-3 left-3 pointer-events-none bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono text-gray-300 flex items-center gap-1.5 z-10">
            <span className="material-symbols-outlined text-[13px] text-primary">drag_pan</span>
            <span>Arrastra la foto o usa la rueda del ratón para hacer zoom</span>
          </div>
        </div>

        {/* Controls Toolbar (Zoom, Rotation, Reset) */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/30 flex flex-wrap items-center justify-between gap-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <span className="text-[11px] font-mono text-gray-400 uppercase flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-sm">zoom_in</span> Zoom:
            </span>
            <button
              type="button"
              disabled={zoom <= 1 || processing}
              onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.2).toFixed(2)))}
              className="text-gray-400 hover:text-white disabled:opacity-30 p-1 rounded hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              disabled={processing}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[#ccff00] h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              disabled={zoom >= 3 || processing}
              onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.2).toFixed(2)))}
              className="text-gray-400 hover:text-white disabled:opacity-30 p-1 rounded hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
            <span className="font-mono text-xs text-primary min-w-[42px] text-right font-bold">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate & Reset buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={processing}
              onClick={handleRotate}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-white/5"
              title="Rotar 90 grados en sentido horario"
            >
              <span className="material-symbols-outlined text-sm">rotate_right</span>
              <span>Girar 90°</span>
            </button>
            <button
              type="button"
              disabled={processing}
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-xs flex items-center gap-1 transition-colors border border-white/5"
              title="Restablecer posición y zoom"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-gray-500">
            {croppedAreaPixels && (
              <span>Resolución de recorte: <strong className="text-gray-300">{croppedAreaPixels.width} &times; {croppedAreaPixels.height} px</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              disabled={processing}
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-mono text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10 disabled:opacity-50"
            >
              Cancelar
            </button>

            {onUploadOriginal && (
              <button
                type="button"
                disabled={processing}
                onClick={onUploadOriginal}
                className="px-4 py-2 rounded-lg font-mono text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors border border-white/10 disabled:opacity-50"
                title="Subir la imagen original sin aplicar ningún recorte"
              >
                Subir Original
              </button>
            )}

            <button
              type="button"
              disabled={processing || !croppedAreaPixels}
              onClick={handleConfirm}
              className="px-5 py-2 rounded-lg font-mono text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Recortar y Subir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
