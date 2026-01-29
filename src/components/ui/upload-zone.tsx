import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileUp, Check, Loader2 } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        setIsUploading(true);
        try {
          await onUpload(file);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2000);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          await onUpload(file);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2000);
        } finally {
          setIsUploading(false);
        }
      }
      e.target.value = "";
    },
    [onUpload]
  );

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative glass rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragging ? "border-primary bg-primary/5" : "border-glass-border hover:border-primary/40"}
        ${uploadSuccess ? "border-success bg-success/5" : ""}
      `}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
          ) : uploadSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4"
            >
              <Check className="w-8 h-8 text-success" />
            </motion.div>
          ) : isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 animate-pulse-glow"
            >
              <FileUp className="w-8 h-8 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4"
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isUploading
            ? "Uploading to 0G Network..."
            : uploadSuccess
            ? "Upload Complete!"
            : "Drop your file here"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isUploading
            ? "Please wait while your file is being stored"
            : uploadSuccess
            ? "Your file has been stored on the decentralized network"
            : "or click to browse • Max 100MB"}
        </p>
      </div>
    </motion.div>
  );
}
