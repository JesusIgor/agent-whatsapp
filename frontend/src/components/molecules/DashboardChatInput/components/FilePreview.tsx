import { memo } from "react";
import { motion } from "framer-motion";
import { X, FileText } from "lucide-react";
import type { UploadedFile } from "@/hooks/useFileUpload";

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

export const FilePreview = memo(function FilePreview({
  file,
  onRemove,
}: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#727B8E]/20 dark:border-[#40485A] bg-[#F4F6F9] dark:bg-[#212225]">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#727B8E] dark:text-[#8a94a6]" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover arquivo ${file.name}`}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <X className="w-3 h-3" />
      </button>
      <p
        className="mt-1 text-[10px] text-[#727B8E] dark:text-[#8a94a6] truncate max-w-[64px]"
        title={file.name}
      >
        {file.name}
      </p>
    </motion.div>
  );
});
