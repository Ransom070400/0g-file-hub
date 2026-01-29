import { motion } from "framer-motion";
import { Database, Wallet, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  walletConnected: boolean;
  walletAddress?: string;
  onConnectWallet: () => void;
}

export function Header({
  walletConnected,
  walletAddress,
  onConnectWallet,
}: HeaderProps) {
  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-b border-glass-border sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="gradient-text">0G</span>
                <span className="text-foreground"> File Hub</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Decentralized File Network
              </p>
            </div>
          </div>

          <Button
            onClick={onConnectWallet}
            variant={walletConnected ? "secondary" : "default"}
            className={
              walletConnected
                ? "font-mono text-sm"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            }
          >
            {walletConnected ? (
              <>
                <Circle className="w-2 h-2 fill-success text-success mr-2" />
                {truncatedAddress}
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
