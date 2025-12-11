import { z } from "zod";

// Order status enum
export const OrderStatusEnum = z.enum([
  "PENDING",
  "PROCESSING", 
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

// Update order status schema
export const updateOrderStatusZodSchema = z.object({
  status: OrderStatusEnum,
  notes: z.string().optional(),
});

// Create order schema (if needed later)
export const createOrderZodSchema = z.object({
  // Add your create order validation fields here
});

// Export types
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusZodSchema>;
export type CreateOrderInput = z.infer<typeof createOrderZodSchema>;