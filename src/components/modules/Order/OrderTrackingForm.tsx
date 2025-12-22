"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";

const OrderTrackingForm = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    if (!orderNumber.startsWith("ORD-")) {
      toast.error("Order number should start with 'ORD-'");
      return;
    }

    setLoading(true);
    try {
      // Redirect to tracking result page
      router.push(`/tracking/${orderNumber.trim()}`);
    } catch (error) {
      toast.error("Failed to track order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="orderNumber" className="text-lg font-medium">
          Order Number
        </Label>
        <p className="text-sm text-gray-500 mb-4">
          Enter the order number you received in your confirmation email
        </p>
        <div className="flex gap-2">
          <Input
            id="orderNumber"
            placeholder="ORD-XXXXXXXXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            className="text-lg py-6"
            required
          />
          <Button
            type="submit"
            size="lg"
            className="px-8"
            disabled={loading || !orderNumber}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Track Order
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-gray-900 mb-2">
            Where to find your order number?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Order confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Your account order history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Shipping confirmation email</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </form>
  );
};

export default OrderTrackingForm;
