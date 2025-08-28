'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useMessageNotifications } from '@/hooks/useMessageNotifications'
import { 
  Mail, 
  Send, 
  User, 
  Calendar, 
  Plus,
  X,
  MessageSquare,
  Inbox
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderEmail: string
  senderRole: string
  receiverId: string
  receiverName: string
  receiverEmail: string
  receiverRole: string
  subject: string
  content: string
  threadId: string | null
  parentId: string | null
  status: string
  createdAt: string
  readAt: string | null
}

export default function CustomerInbox() {
  const { data: session } = useSession()
  const router = useRouter()
  const { unreadCount, refreshUnreadCount } = useMessageNotifications()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    subject: '',
    content: ''
  })

  // Reply form state
  const [replyContent, setReplyContent] = useState('')
  const [showReply, setShowReply] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }
    fetchMessages()
  }, [activeTab, session])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?type=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        refreshUnreadCount() // Update real-time count
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessageToAdmin = async () => {
    if (!composeForm.subject || !composeForm.content) {
      toast.error('Please fill all fields')
      return
    }

    try {
      // First get admin users
      const usersResponse = await fetch('/api/users')
      if (!usersResponse.ok) {
        toast.error('Failed to fetch admin information')
        return
      }

      const usersData = await usersResponse.json()
      const admins = usersData.users.filter((u: any) => u.role === 'admin' || u.role === 'super_admin')
      
      if (admins.length === 0) {
        toast.error('No admin available to receive messages')
        return
      }

      // Send to first available admin
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: admins[0].id,
          subject: composeForm.subject,
          content: composeForm.content
        })
      })

      if (response.ok) {
        toast.success('Message sent to admin successfully')
        setShowCompose(false)
        setComposeForm({ subject: '', content: '' })
        fetchMessages()
        refreshUnreadCount()
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const sendReply = async () => {
    if (!replyContent || !selectedMessage) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedMessage.senderId,
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent,
          parentId: selectedMessage.id
        })
      })

      if (response.ok) {
        toast.success('Reply sent successfully')
        setReplyContent('')
        setShowReply(false)
        fetchMessages()
        refreshUnreadCount()
      } else {
        toast.error('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, status: 'read' })
      })
      fetchMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-sm text-gray-600">
              Communicate with our support team
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Message
            </button>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center justify-between ${
                  activeTab === 'inbox' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Inbox className="w-5 h-5 mr-3" />
                  <span>Inbox</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'sent' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <Send className="w-5 h-5 mr-3" />
                <span>Sent</span>
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <button
                    onClick={() => setShowCompose(true)}
                    className="mt-4 text-primary-600 hover:text-primary-700"
                  >
                    Send your first message
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        message.status === 'unread' && activeTab === 'inbox' ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (message.status === 'unread' && activeTab === 'inbox') {
                          markAsRead(message.id)
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className={`text-sm ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                              {activeTab === 'inbox' ? 'From Admin' : 'To Admin'}
                            </span>
                          </div>
                          <h3 className={`text-lg mb-1 ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                            {message.subject}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                          {message.status === 'unread' && activeTab === 'inbox' && (
                            <span className="inline-block mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compose Modal */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold">New Message to Admin</h2>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="What is this about?"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={composeForm.content}
                      onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Type your message here..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendMessageToAdmin}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <button
                    onClick={() => {
                      setSelectedMessage(null)
                      setShowReply(false)
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {activeTab === 'inbox' ? 'Admin Support' : 'You'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {activeTab === 'inbox' && !showReply && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowReply(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {showReply && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Reply</h3>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Type your reply..."
                      />
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowReply(false)
                            setReplyContent('')
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={sendReply}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}