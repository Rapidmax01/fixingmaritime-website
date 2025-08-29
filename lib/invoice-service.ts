import prisma from '@/lib/database'

interface InvoiceData {
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  serviceId?: string
  serviceName: string
  description: string
  amount: number
  tax?: number
  currency?: string
  dueDate?: Date
  notes?: string
  items?: any[]
  createdBy: string
}

export async function generateInvoice(data: InvoiceData) {
  if (!prisma) {
    throw new Error('Database not available')
  }

  // Generate unique invoice number
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
  
  // Calculate total
  const tax = data.tax || 0
  const total = data.amount + tax

  // Set default due date (30 days from now)
  const dueDate = data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: data.customerId || `cust_${Date.now()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      customerAddress: data.customerAddress || null,
      serviceId: data.serviceId || null,
      serviceName: data.serviceName,
      description: data.description,
      amount: data.amount,
      tax,
      total,
      currency: data.currency || 'NGN',
      status: 'pending',
      dueDate,
      notes: data.notes || null,
      items: data.items || undefined,
      createdBy: data.createdBy
    }
  })

  return invoice
}

export async function markInvoiceAsPaid(
  invoiceId: string, 
  paymentMethod?: string, 
  paymentRef?: string
) {
  if (!prisma) {
    throw new Error('Database not available')
  }

  return await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'paid',
      paidAt: new Date(),
      paymentMethod: paymentMethod || null,
      paymentRef: paymentRef || null,
      updatedAt: new Date()
    }
  })
}

export async function getCustomerInvoices(customerId: string, customerEmail: string) {
  if (!prisma) {
    return []
  }

  return await prisma.invoice.findMany({
    where: {
      OR: [
        { customerId },
        { customerEmail }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function generateInvoiceFromQuote(quoteId: string, adminId: string) {
  if (!prisma) {
    throw new Error('Database not available')
  }

  // Get quote details
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId }
  })

  if (!quote) {
    throw new Error('Quote not found')
  }

  if (quote.status !== 'accepted') {
    throw new Error('Quote must be accepted before generating invoice')
  }

  // Generate invoice from quote
  return await generateInvoice({
    customerId: quote.userId || undefined,
    customerName: quote.name,
    customerEmail: quote.email,
    customerPhone: quote.phone || undefined,
    customerAddress: quote.company || 'Not specified',
    serviceName: quote.serviceName,
    description: `${quote.serviceName} service. ${quote.projectDescription}`.trim(),
    amount: parseFloat(quote.quotedAmount?.toString() || '0'),
    tax: parseFloat(quote.quotedAmount?.toString() || '0') * 0.075, // 7.5% VAT
    currency: quote.quotedCurrency || 'NGN',
    notes: quote.adminResponse || undefined,
    createdBy: adminId
  })
}