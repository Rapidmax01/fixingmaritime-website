'use client'

import { useContent } from '@/contexts/ContentContext'
import { useEffect, useState } from 'react'

export default function DebugContent() {
  const { content, loading, error } = useContent()
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    // Fetch directly from API to compare
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Content Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Context State</h2>
          <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
          <p><strong>Error:</strong> {error || 'none'}</p>
          <p><strong>Content Available:</strong> {content ? 'yes' : 'no'}</p>
          
          {content && (
            <div className="mt-4">
              <h3 className="font-medium">About Section:</h3>
              <p><strong>Title:</strong> {content.sections?.about?.title}</p>
              <p><strong>Content:</strong> {content.sections?.about?.content}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Direct API Call</h2>
          {apiData ? (
            <div>
              <h3 className="font-medium">About Section from API:</h3>
              <p><strong>Title:</strong> {apiData.sections?.about?.title}</p>
              <p><strong>Content:</strong> {apiData.sections?.about?.content}</p>
              
              <h3 className="font-medium mt-4">All Sections:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(apiData.sections, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Loading API data...</p>
          )}
        </div>
      </div>
    </div>
  )
}