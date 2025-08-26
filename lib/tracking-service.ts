import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generate a unique order number in format: ORD-YYYY-NNNNNN
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  
  // Get the latest order number for this year
  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `ORD-${year}-`
      }
    },
    orderBy: {
      orderNumber: 'desc'
    }
  })

  let nextNumber = 1
  if (latestOrder) {
    const currentNumber = parseInt(latestOrder.orderNumber.split('-')[2])
    nextNumber = currentNumber + 1
  }

  return `ORD-${year}-${nextNumber.toString().padStart(6, '0')}`
}

/**
 * Generate a unique tracking number in format: TRK-FX-NNNNNN
 */
export async function generateTrackingNumber(): Promise<string> {
  // Get the latest tracking number
  const latestOrder = await prisma.order.findFirst({
    where: {
      trackingNumber: {
        startsWith: 'TRK-FX-'
      }
    },
    orderBy: {
      trackingNumber: 'desc'
    }
  })

  let nextNumber = 1
  if (latestOrder) {
    const currentNumber = parseInt(latestOrder.trackingNumber.split('-')[2])
    nextNumber = currentNumber + 1
  }

  return `TRK-FX-${nextNumber.toString().padStart(6, '0')}`
}

/**
 * Create initial tracking events for a new order
 */
export async function createInitialTrackingEvents(orderId: string, paymentStatus: string) {
  const events = []
  
  // Order placed event
  events.push({
    orderId,
    status: 'order_placed',
    title: 'Order Placed',
    description: 'Your order has been successfully placed',
    location: 'System',
    createdAt: new Date()
  })

  // Payment event (if paid)
  if (paymentStatus === 'paid') {
    events.push({
      orderId,
      status: 'payment_confirmed',
      title: 'Payment Confirmed',
      description: 'Payment has been successfully processed',
      location: 'Payment Gateway',
      createdAt: new Date(Date.now() + 1000) // 1 second later
    })
  }

  return prisma.trackingEvent.createMany({
    data: events
  })
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
  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: getOrderStatusFromTrackingStatus(status),
      deliveredAt: status === 'delivered' ? new Date() : undefined
    }
  })

  // Create tracking event
  return prisma.trackingEvent.create({
    data: {
      orderId,
      status,
      title,
      description,
      location,
      remarks,
      updatedBy
    }
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
  const order = await prisma.order.findUnique({
    where: { trackingNumber },
    include: {
      trackingHistory: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return order
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