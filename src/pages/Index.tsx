import { motion } from "framer-motion";
import { Files, HardDrive, Activity, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { UploadZone } from "@/components/ui/upload-zone";
import { HashSearch } from "@/components/ui/hash-search";
import { FileCard } from "@/components/ui/file-card";
import { StatCard } from "@/components/ui/stat-card";
import { useStorage } from "@/hooks/use-storage";

const Index = () => {
  const {
    files,
    isConnected,
    walletAddress,
    connectWallet,
    uploadFile,
    downloadByHash,
    downloadFile,
  } = useStorage();

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header
        walletConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={connectWallet}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Files}
            label="Total Files"
            value={files.length.toString()}
            subValue="Stored on network"
            variant="primary"
          />
          <StatCard
            icon={HardDrive}
            label="Storage Used"
            value="0.0 MB"
            subValue="Across all files"
            variant="accent"
          />
          <StatCard
            icon={Activity}
            label="Network Status"
            value="Active"
            subValue="12 nodes connected"
          />
          <StatCard
            icon={Zap}
            label="Avg Upload Speed"
            value="2.4 MB/s"
            subValue="Last 24 hours"
          />
        </motion.div>

        {/* Upload & Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UploadZone onUpload={uploadFile} />
          </motion.div>
          <HashSearch onSearch={downloadByHash} />
        </div>

        {/* Files Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Stored Files</h2>
              <p className="text-sm text-muted-foreground">
                Your files on the decentralized network
              </p>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <Files className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No files yet
              </h3>
              <p className="text-muted-foreground">
                Upload your first file to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <FileCard
                    name={file.name}
                    hash={file.hash}
                    size={file.size}
                    uploadedAt={file.uploadedAt}
                    onDownload={() => downloadFile(file)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Powered by{" "}
              <span className="gradient-text font-semibold">0G Network</span>
            </p>
            <p>Built with @0glabs/0g-ts-sdk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
