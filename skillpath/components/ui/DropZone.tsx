'use client';

import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        onFileSelect(selected);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      onFileSelect(selected);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (file) {
    return (
      <div className={`h-[120px] w-full border border-white/20 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-between px-6 transition-all ${className}`}>
        <div className="flex flex-col">
          <span className="font-mono text-sm text-white truncate max-w-[200px] sm:max-w-[400px]">{file.name}</span>
          <span className="font-mono text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <button onClick={clearFile} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Remove file">
          <X size={18} className="text-white" />
        </button>
      </div>
    );
  }
 
  return (
    <div 
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`h-[120px] w-full border border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all backdrop-blur-md
        ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-white/5'}
        hover:border-blue-400 hover:bg-white/10
        ${className}
      `}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        accept="application/pdf" 
        className="hidden" 
      />
      <span className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors">Drop PDF here or click to upload</span>
    </div>
  );
};
