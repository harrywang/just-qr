"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizes = [
  { label: "Small (256px)", value: 256 },
  { label: "Medium (512px)", value: 512 },
  { label: "Large (1024px)", value: 1024 },
];

export function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(512);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (text: string) => {
    try {
      const url = new URL(text);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return false;
      }
      // Reject if URL contains another protocol (e.g., pasted twice)
      const protocolCount = (text.match(/https?:\/\//g) || []).length;
      if (protocolCount > 1) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (!newUrl) {
      setQrCode(null);
      setError(null);
      return;
    }
    if (!isValidUrl(newUrl)) {
      setQrCode(null);
      setError("Invalid URL");
      return;
    }
    setError(null);
    QRCode.toDataURL(newUrl, {
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setQrCode)
      .catch(() => setQrCode(null));
  };

  const reset = () => {
    setUrl("");
    setQrCode(null);
    setError(null);
  };

  const downloadQRCode = async () => {
    if (!url) return;

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: selectedSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const link = document.createElement("a");
      link.download = `qrcode-${selectedSize}px.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error downloading QR code:", err);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image
            src="/qrcode.svg"
            alt="QR Code Logo"
            width={40}
            height={40}
          />
          <CardTitle className="text-2xl md:text-3xl">Just QR</CardTitle>
        </div>
        <CardDescription className="text-center">Generate and download QR code for any URL</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="https://example.com"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="min-h-[120px]"
          />
          {error && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-rose-500">{error}</p>
              <Button onClick={reset} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          )}
        </div>

        {qrCode && (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-lg border bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="QR Code" className="h-48 w-48" />
            </div>

            <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Select
                value={selectedSize.toString()}
                onValueChange={(value) => setSelectedSize(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.value} value={size.value.toString()}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button onClick={downloadQRCode} className="flex-1 sm:flex-none">
                  Download
                </Button>
                <Button onClick={reset} variant="outline" className="flex-1 sm:flex-none">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
