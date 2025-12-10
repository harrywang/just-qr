import Image from "next/image";
import { QRGenerator } from "@/components/qr-generator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-muted/50">
      <div className="w-full max-w-md">
        <QRGenerator />
      </div>

      <div className="mt-6 mb-2 flex items-center gap-1">
        <a
          href="https://github.com/harrywang/just-qr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="View source on GitHub"
        >
          <Image src="/github.svg" alt="GitHub" width={24} height={24} className="dark:invert" />
        </a>
        <div className="text-sm text-muted-foreground">
          Made by <a
            href="https://harrywang.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            Harry Wang
          </a>
        </div>
      </div>
    </div>
  );
}
