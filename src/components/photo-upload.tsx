'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';

interface PhotoUploadProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  required?: boolean;
  driveFolderId?: string | null;
}

export default function PhotoUpload({
  label,
  photos,
  onPhotosChange,
  maxPhotos = 5,
  required = true,
  driveFolderId,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    if (driveFolderId) {
      formData.append('driveFolderId', driveFolderId);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Upload failed');
        return null;
      }

      const data = await response.json() as { url?: string };
      return data.url || null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith('image/')
      );

      if (fileArray.length === 0) return;

      const remainingSlots = maxPhotos - photos.length;
      const filesToUpload = fileArray.slice(0, remainingSlots);

      if (filesToUpload.length === 0) return;

      setUploading(true);

      try {
        const uploadPromises = filesToUpload.map(uploadFile);
        const results = await Promise.all(uploadPromises);

        const successfulUploads = results.filter(
          (url): url is string => url !== null
        );

        if (successfulUploads.length > 0) {
          onPhotosChange([...photos, ...successfulUploads]);
        }

        if (successfulUploads.length < filesToUpload.length) {
          alert('Some photos failed to upload. Please try again.');
        }
      } catch (error) {
        console.error('Batch upload error:', error);
        alert('Failed to upload photos. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [photos, onPhotosChange, maxPhotos]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {photos.length === maxPhotos && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Complete
            </span>
          )}
          <span className="text-xs text-slate-400 font-medium">
            {photos.length}/{maxPhotos}
          </span>
        </div>
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-300 transition-colors shadow-sm"
            >
              <img
                src={url}
                alt={`${label} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-1.5 right-1.5 bg-red-500/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-[10px] text-white font-semibold">Photo {index + 1}</p>
              </div>
            </div>
          ))}

          {/* Add more button */}
          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center justify-center transition-all group"
            >
              <ImagePlus className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[10px] text-slate-400 mt-1 group-hover:text-emerald-600">Add</span>
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
                e.target.value = '';
              }
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700">Uploading to Google Drive...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-slate-400">
                PNG, JPG, WEBP &bull; Max {maxPhotos - photos.length} more
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
