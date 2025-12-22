/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Search,
  QrCode,
  Clipboard,
  ClipboardCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const TrackingSearch = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Sample tracking numbers for testing
  const sampleTrackingNumbers = [
    "TRK-123456789",
    "FEDEX-987654321",
    "UPS-456123789",
    "USPS-789456123",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setLoading(true);
    try {
      // Navigate to tracking results page
      router.push(`/tracking/${trackingNumber.trim()}`);
    } catch (error) {
      toast.error("Failed to track package");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTrackingNumber(text.trim());
      toast.success("Pasted from clipboard!");
    } catch (error: any) {
      toast.error("Unable to access clipboard", error);
    }
  };

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="trackingNumber" className="text-lg font-medium">
            Enter Tracking Number
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            You can find your tracking number in your shipping confirmation
            email
          </p>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Input
                id="trackingNumber"
                placeholder="e.g., TRK-123456789 or FEDEX-987654321"
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value.toUpperCase())
                }
                className="text-lg py-6 pl-12 pr-10"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              {trackingNumber && (
                <button
                  type="button"
                  onClick={() => setTrackingNumber("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="px-8 whitespace-nowrap"
              disabled={loading || !trackingNumber}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Track Package
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="flex items-center gap-2"
            >
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("qr-scanner")?.click()}
              className="flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Scan QR Code
            </Button>
            <input
              type="file"
              id="qr-scanner"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Sample Tracking Numbers for Testing */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-3">
              Sample Tracking Numbers (for testing)
            </h3>
            <div className="flex flex-wrap gap-2">
              {sampleTrackingNumbers.map((number) => (
                <div
                  key={number}
                  className="group relative"
                  onClick={() => setTrackingNumber(number)}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-blue-100 cursor-pointer pr-8"
                  >
                    {number}
                  </Button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(number);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied ? (
                      <ClipboardCheck className="w-3 h-3 text-green-600" />
                    ) : (
                      <Clipboard className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default TrackingSearch;
