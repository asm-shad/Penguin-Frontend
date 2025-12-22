// app/tracking/page.tsx
import TrackingSearch from "@/components/modules/Shipping/TrackingSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, Shield } from "lucide-react";

const TrackingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number to check the real-time status of your
            delivery.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <TrackingSearch />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Real-time Tracking
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Get live updates on your package location and estimated delivery
                time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Delivery History
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                View complete timeline of your order from processing to
                delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Carrier Information
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Get details about your shipping carrier and contact information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Safe Delivery</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your package is insured and handled with care throughout the
                journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Where can I find my tracking number?
                </h3>
                <p className="text-gray-600">
                  Your tracking number is provided in the shipping confirmation
                  email sent after your order is dispatched. You can also find
                  it in your order history if you&apos;re logged in.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How often is tracking information updated?
                </h3>
                <p className="text-gray-600">
                  Tracking information is updated in real-time as your package
                  moves through the shipping network. Major updates occur when
                  packages are scanned at facilities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What does &quot;Out for Delivery&quot; mean?
                </h3>
                <p className="text-gray-600">
                  This means your package is on the delivery vehicle and will be
                  delivered to your address today. Please ensure someone is
                  available to receive it.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  My tracking hasn&apos;t updated in a while. What should I do?
                </h3>
                <p className="text-gray-600">
                  Sometimes tracking updates can be delayed. If it&apos;s been
                  more than 48 hours without an update, please contact our
                  customer support for assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
