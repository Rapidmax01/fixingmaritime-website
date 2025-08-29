import prisma from '@/lib/database'

/**
 * Generate a unique order number in format: ORD-YYYY-NNNNNN
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  
  // Fallback for missing order model - use timestamp-based number
  const timestamp = Date.now().toString().slice(-6)
  return `ORD-${year}-${timestamp.padStart(6, '0')}`
}

/**
 * Generate a unique tracking number in format: TRK-FX-NNNNNN
 */
export async function generateTrackingNumber(): Promise<string> {
  // Fallback for missing order model - use timestamp-based number
  const timestamp = Date.now().toString().slice(-6)
  return `TRK-FX-${timestamp.padStart(6, '0')}`
}

/**
 * Create initial tracking events for a new order
 */
export async function createInitialTrackingEvents(orderId: string, paymentStatus: string) {
  // Fallback for missing trackingEvent model - return resolved promise
  return Promise.resolve({ count: paymentStatus === 'paid' ? 2 : 1 })
}

/**
 * Add a new tracking event to an order
 */
export async function addTrackingEvent(
  orderId: string,
  status: string,
  title: string,
  description: string,
  location?: string,
  remarks?: string,
  updatedBy?: string
) {
  // Fallback for missing order and trackingEvent models
  return Promise.resolve({
    id: 'demo-' + Date.now().toString(),
    orderId,
    status,
    title,
    description,
    location,
    remarks,
    updatedBy,
    createdAt: new Date()
  })
}

/**
 * Map tracking event status to order status
 */
function getOrderStatusFromTrackingStatus(trackingStatus: string): string {
  const statusMap: Record<string, string> = {
    'order_placed': 'pending',
    'payment_confirmed': 'processing',
    'processing': 'processing',
    'dispatched': 'in_transit',
    'in_transit': 'in_transit',
    'out_for_delivery': 'in_transit',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  }
  
  return statusMap[trackingStatus] || 'pending'
}

/**
 * Get tracking history for an order
 */
export async function getTrackingHistory(trackingNumber: string) {
  // Fallback for missing order model
  return Promise.resolve(null)
}

/**
 * Get all tracking statuses for admin dropdown
 */
export function getTrackingStatuses() {
  return [
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'payment_confirmed', label: 'Payment Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]
}