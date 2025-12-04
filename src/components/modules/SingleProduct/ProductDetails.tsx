"use client";
import { IProduct, IProductReview } from "@/types/product.interface";
import { useState } from "react";
import {
  Star,
  User,
  Calendar,
  CheckCircle,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsProps {
  product: IProduct;
  reviews?: IProductReview[];
}

const ProductDetails = ({ product, reviews = [] }: ProductDetailsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");

  // Calculate average rating
  const averageRating =
    product.averageRating ||
    (reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0);

  // Get primary category
  const primaryCategory = product.productCategories?.[0]?.category;

  // Get all specifications from product
  const specifications = [
    { label: "Brand", value: product.brand?.name || "N/A" },
    { label: "Category", value: primaryCategory?.name || "N/A" },
    { label: "SKU", value: product.sku || "N/A" },
    { label: "Status", value: product.status },
    {
      label: "Stock",
      value:
        product.stock > 0 ? `${product.stock} units available` : "Out of Stock",
    },
    { label: "Warranty", value: "1 Year" },
    { label: "Weight", value: "2.5 kg" },
    { label: "Dimensions", value: "15 × 10 × 5 cm" },
    { label: "Material", value: "Premium Quality" },
  ];

  // Features list
  const features = [
    "High-quality materials",
    "Durable construction",
    "Easy to maintain",
    "Eco-friendly packaging",
    "1-year warranty",
    "Free shipping",
  ];

  // Handle review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review to your API
    console.log({ rating, reviewText, reviewerName, reviewerEmail });
    // Reset form
    setRating(0);
    setReviewText("");
    setReviewerName("");
    setReviewerEmail("");
    // Show success message
    alert("Review submitted successfully!");
  };

  return (
    <div className="py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="additional">Additional Information</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Product Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    "Discover the perfect blend of style and functionality with our premium product. Crafted with attention to detail and built to last, this product is designed to enhance your daily experience."}
                </p>

                <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    Key Features:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <Shield className="w-10 h-10 text-green-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">
                  Quality Assurance
                </h4>
                <p className="text-gray-600 text-sm">
                  Every product undergoes rigorous quality checks to ensure
                  durability and performance.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border">
                <Truck className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">
                  Enjoy quick and reliable delivery service with real-time
                  tracking updates.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border">
                <RotateCcw className="w-10 h-10 text-orange-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">Easy Returns</h4>
                <p className="text-gray-600 text-sm">
                  30-day return policy with no questions asked. Your
                  satisfaction is guaranteed.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="mt-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Specifications</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 font-medium text-gray-700 border-r w-1/3">
                          {spec.label}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Care Instructions */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Care Instructions</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                  Clean with a soft, dry cloth regularly
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                  Avoid exposure to extreme temperatures
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                  Store in a cool, dry place when not in use
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                  Do not use harsh chemicals for cleaning
                </li>
              </ul>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-lg border">
              <h4 className="text-xl font-semibold mb-6">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Visit Us</h5>
                  <p className="text-gray-600">New Orleans, USA</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Call Us</h5>
                  <p className="text-gray-600">+12 958 648 597</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">
                    Working Hours
                  </h5>
                  <p className="text-gray-600">Mon – Sat: 10:00 AM – 7:00 PM</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Email Us</h5>
                  <p className="text-gray-600">Shepeart@gmr.com</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-8">
          <div className="space-y-8">
            {/* Overall Rating */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="text-4xl font-bold">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>

                <div className="space-y-2 min-w-[200px]">
                  {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = reviews.filter(
                      (r) => r.rating === ratingValue
                    ).length;
                    const percentage =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                    return (
                      <div
                        key={ratingValue}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm text-gray-600 w-8">
                          {ratingValue} star
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Customer Reviews</h4>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="font-medium">
                              {review.user?.name || "Anonymous"}
                            </h5>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {review.title && (
                        <h6 className="font-medium text-gray-800 mb-2">
                          {review.title}
                        </h6>
                      )}

                      <p className="text-gray-700">{review.comment}</p>

                      {/* {review.verifiedPurchase && (
                        <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">
                          Verified Purchase
                        </Badge>
                      )} */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h5 className="text-lg font-medium text-gray-700 mb-2">
                    No reviews yet
                  </h5>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Be the first to share your thoughts about this product!
                  </p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="border rounded-lg p-6 mt-8">
              <h4 className="text-xl font-semibold mb-6">Write a Review</h4>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Rating *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={reviewerEmail}
                      onChange={(e) => setReviewerEmail(e.target.value)}
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Review *
                  </label>
                  <Textarea
                    id="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-shop_light_green hover:bg-shop_dark_green"
                  disabled={
                    rating === 0 ||
                    !reviewText.trim() ||
                    !reviewerName ||
                    !reviewerEmail
                  }
                >
                  Submit Review
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetails;
