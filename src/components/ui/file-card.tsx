import { motion } from "framer-motion";
import { File, Download, Clock, HardDrive } from "lucide-react";
import { Button } from "./button";

interface FileCardProps {
  name: string;
  hash: string;
  size: string;
  uploadedAt: string;
  onDownload: () => void;
}

export function FileCard({ name, hash, size, uploadedAt, onDownload }: FileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 group hover:border-primary/40 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <File className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{name}</h3>
          <p className="text-xs font-mono text-muted-foreground mt-1 truncate">
            {hash}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5" />
          <span>{size}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{uploadedAt}</span>
        </div>
      </div>

      <Button
        onClick={onDownload}
        variant="secondary"
        size="sm"
        className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </motion.div>
  );
}
