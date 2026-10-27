import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this device/browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You can grant access in browser settings, or use one of our sample scan images below!'
          : 'Unable to access your device camera. You can upload an image directly or choose a sample scan.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleUsePhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const sampleSnapshots = [
    { name: 'Chicken Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
    { name: 'Masala Dosa', url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80' },
    { name: 'Fresh Apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleSelectSample = (url: string) => {
    setCapturedPhoto(url);
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Scan Food with Camera</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {capturedPhoto ? (
            <div className="relative w-full h-full">
              <img src={capturedPhoto} alt="Captured food" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Ready</span>
              </div>
            </div>
          ) : cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Or pick a demo camera sample:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sampleSnapshots.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleSelectSample(item.url)}
                      className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition-all text-left"
                    >
                      <img src={item.url} alt={item.name} className="w-full h-16 object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white truncate">{item.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Reticle Overlay */}
              <div className="absolute inset-8 border-2 border-emerald-400/70 border-dashed rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="text-center text-xs font-semibold text-emerald-300 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full mx-auto">
                  Center food dish in frame
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-5 bg-slate-900 flex items-center justify-between border-t border-slate-800">
          {capturedPhoto ? (
            <div className="flex w-full items-center justify-between gap-4">
              <button
                onClick={retakePhoto}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleUsePhoto}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Use & Analyze Photo</span>
              </button>
            </div>
          ) : !cameraError ? (
            <div className="flex w-full items-center justify-between">
              <button
                onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
                className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Flip Camera
              </button>
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-white" />
              </button>
              <div className="w-16" /> {/* Balance spacer */}
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
