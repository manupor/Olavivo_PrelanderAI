'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'

interface LogoUploaderProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function LogoUploader({ onUpload, currentUrl }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.data.url)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
  })

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      onUpload(urlInput.trim())
      setUrlInput('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Logo Preview */}
      {currentUrl && (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <img
            src={currentUrl}
            alt="Current logo"
            className="w-16 h-16 object-contain bg-white rounded border"
          />
          <div>
            <p className="text-sm font-medium">Current logo</p>
            <p className="text-xs text-gray-500">Upload a new one to replace</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop your logo here'
                : 'Drag & drop your logo, or click to browse'}
            </p>
            <p className="text-xs text-gray-500">PNG, SVG, JPEG up to 2MB</p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* URL Input Alternative */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or paste a URL</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/logo.png"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleUrlSubmit(e as any)
            }
          }}
        />
        <Button 
          type="button" 
          onClick={handleUrlSubmit}
          disabled={!urlInput.trim()}
        >
          Use URL
        </Button>
      </div>
    </div>
  )
}
