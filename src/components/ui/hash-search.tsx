import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface HashSearchProps {
  onSearch: (hash: string) => Promise<void>;
}

export function HashSearch({ onSearch }: HashSearchProps) {
  const [hash, setHash] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;

    setIsSearching(true);
    try {
      await onSearch(hash.trim());
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Search className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Download by Hash</h3>
          <p className="text-xs text-muted-foreground">
            Retrieve any file from the network
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Enter file hash (0x...)"
          className="flex-1 font-mono text-sm bg-input border-glass-border focus:border-accent"
        />
        <Button
          type="submit"
          disabled={!hash.trim() || isSearching}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.form>
  );
}
