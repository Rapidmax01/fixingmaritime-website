'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useMessageNotifications } from '@/hooks/useMessageNotifications'
import { 
  Mail, 
  Send, 
  Search, 
  User, 
  Calendar, 
  Plus,
  X,
  Clock,
  Check,
  Archive,
  MessageSquare,
  Users,
  Shield,
  Paperclip,
  Upload,
  File,
  Trash2
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
  attachments?: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
  }> | null
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminInbox() {
  const router = useRouter()
  const { unreadCount, refreshUnreadCount } = useMessageNotifications()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')
  const [searchTerm, setSearchTerm] = useState('')

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    receiverId: '',
    subject: '',
    content: '',
    attachments: [] as Array<{
      id: string
      name: string
      size: number
      type: string
      url: string
    }>
  })

  // Reply form state
  const [replyContent, setReplyContent] = useState('')
  const [showReply, setShowReply] = useState(false)
  const [replyAttachments, setReplyAttachments] = useState<Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
  }>>([])

  // File upload state
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Add small delay to ensure admin auth is set up
    const timer = setTimeout(() => {
      fetchMessages()
      fetchUsers()
    }, 100)
    return () => clearTimeout(timer)
  }, [activeTab])

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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        return data.attachment
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload file')
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isReply = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    const attachment = await uploadFile(file)
    if (attachment) {
      if (isReply) {
        setReplyAttachments(prev => [...prev, attachment])
      } else {
        setComposeForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachment]
        }))
      }
      toast.success('File uploaded successfully')
    }

    // Reset file input
    event.target.value = ''
  }

  const removeAttachment = (attachmentId: string, isReply = false) => {
    if (isReply) {
      setReplyAttachments(prev => prev.filter(att => att.id !== attachmentId))
    } else {
      setComposeForm(prev => ({
        ...prev,
        attachments: prev.attachments.filter(att => att.id !== attachmentId)
      }))
    }
  }

  const sendMessage = async () => {
    if (!composeForm.receiverId || !composeForm.subject || !composeForm.content) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...composeForm,
          attachments: composeForm.attachments.length > 0 ? composeForm.attachments : null
        })
      })

      if (response.ok) {
        toast.success('Message sent successfully')
        setShowCompose(false)
        setComposeForm({ receiverId: '', subject: '', content: '', attachments: [] })
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
          parentId: selectedMessage.id,
          attachments: replyAttachments.length > 0 ? replyAttachments : null
        })
      })

      if (response.ok) {
        toast.success('Reply sent successfully')
        setReplyContent('')
        setReplyAttachments([])
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
      refreshUnreadCount()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })

      if (response.ok) {
        toast.success('Message deleted successfully')
        setSelectedMessage(null)
        fetchMessages()
        refreshUnreadCount()
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
            <p className="mt-2 text-sm text-gray-600">
              Communicate with your customers directly
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Compose Button */}
            <button
              onClick={() => setShowCompose(true)}
              className="w-full mb-6 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Compose New Message
            </button>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center justify-between ${
                  activeTab === 'inbox' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
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

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading messages...
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
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
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span className={`text-sm ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                              {activeTab === 'inbox' ? message.senderName : message.receiverName}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({activeTab === 'inbox' ? message.senderEmail : message.receiverEmail})
                            </span>
                          </div>
                          <h3 className={`text-lg mb-1 flex items-center ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                            {message.subject}
                            {message.attachments && message.attachments.length > 0 && (
                              <Paperclip className="w-4 h-4 ml-2 text-gray-400" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                            {message.status === 'unread' && activeTab === 'inbox' && (
                              <span className="inline-block mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteMessage(message.id)
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                  <h2 className="text-xl font-semibold">Compose Message</h2>
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
                      To
                    </label>
                    <select
                      value={composeForm.receiverId}
                      onChange={(e) => setComposeForm({ ...composeForm, receiverId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a recipient</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter subject"
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

                  {/* Attachments */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </label>
                    
                    {/* File Upload */}
                    <div className="mb-3">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                        id="compose-file-upload"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="compose-file-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Paperclip className="w-4 h-4 mr-2" />
                            Attach File
                          </>
                        )}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 10MB. Supported: PDF, DOC, XLS, TXT, Images
                      </p>
                    </div>

                    {/* Attachment List */}
                    {composeForm.attachments.length > 0 && (
                      <div className="space-y-2">
                        {composeForm.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <File className="w-4 h-4 mr-2 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(attachment.id, false)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendMessage}
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {activeTab === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({activeTab === 'inbox' ? selectedMessage.senderEmail : selectedMessage.receiverEmail})
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

                  {/* Attachments Display */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Attachments</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <File className="w-4 h-4 mr-2 text-gray-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                      {/* Reply Attachments */}
                      <div className="mt-4">
                        <div className="mb-3">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                            id="reply-file-upload"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="reply-file-upload"
                            className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Paperclip className="w-3 h-3 mr-2" />
                                Attach File
                              </>
                            )}
                          </label>
                        </div>

                        {/* Reply Attachment List */}
                        {replyAttachments.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {replyAttachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <File className="w-3 h-3 mr-2 text-gray-500" />
                                  <div>
                                    <p className="text-xs font-medium">{attachment.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {(attachment.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeAttachment(attachment.id, true)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowReply(false)
                            setReplyContent('')
                            setReplyAttachments([])
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