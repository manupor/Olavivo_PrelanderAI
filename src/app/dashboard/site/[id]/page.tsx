'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Site } from '@/lib/types'

interface SiteDetailPageProps {
  params: {
    id: string
  }
}

export default function SiteDetailPage({ params }: SiteDetailPageProps) {
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchSite()
  }, [params.id])

  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/sites/${params.id}`)
      if (response.ok) {
        const result = await response.json()
        setSite(result.data)
      }
    } catch {
      console.error('Error fetching site:')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!site) return

    setPublishing(true)
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId: site.id }),
      })

      if (response.ok) {
        setSite({ ...site, status: 'published' })
      } else {
        alert('Failed to publish site')
      }
    } catch (error) {
      alert('Failed to publish site')
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = async () => {
    if (!site) return

    try {
      const response = await fetch(`/api/export?siteId=${site.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${site.brand_name}-landing-page.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to download package')
      }
    } catch (error) {
      alert('Failed to download package')
    }
  }

  const handleRegenerate = async () => {
    if (!site) return

    setRegenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: site.template_id,
          logoUrl: site.logo_url,
          brandName: site.brand_name,
          industry: site.industry,
          description: site.description,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/site/${result.data.site.id}`)
      } else {
        alert('Failed to regenerate site')
      }
    } catch (error) {
      alert('Failed to regenerate site')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Site not found</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{site.brand_name}</h1>
              <p className="text-gray-600">/{site.slug}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
              {site.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`/sites/${site.slug}`, '_blank')}
                >
                  View Live Site
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Site Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Brand Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Brand Information</h3>
              <div className="space-y-3">
                {site.logo_url && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={site.logo_url}
                      alt="Logo"
                      className="w-12 h-12 object-contain bg-gray-50 rounded border"
                    />
                    <span className="text-sm text-gray-600">Brand Logo</span>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-700">Industry:</span>
                  <span className="ml-2 text-sm text-gray-600">{site.industry}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Template:</span>
                  <span className="ml-2 text-sm text-gray-600">
                    Template {site.template_id.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      site.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: site.primary_color }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium">Primary</div>
                    <div className="text-xs text-gray-500">{site.primary_color}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: site.secondary_color }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium">Secondary</div>
                    <div className="text-xs text-gray-500">{site.secondary_color}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: site.accent_color }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium">Accent</div>
                    <div className="text-xs text-gray-500">{site.accent_color}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Generated Copy</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Headline:</div>
                  <div className="text-sm text-gray-600 mt-1">{site.headline}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Subheadline:</div>
                  <div className="text-sm text-gray-600 mt-1">{site.subheadline}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Call to Action:</div>
                  <div className="text-sm text-gray-600 mt-1">{site.cta}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {site.status === 'draft' && (
                  <Button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full"
                  >
                    {publishing ? 'Publishing...' : 'Publish Site'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="w-full"
                >
                  {regenerating ? 'Regenerating...' : 'Regenerate with AI'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="w-full"
                >
                  Download Package
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Live Preview</h3>
              </div>
              <div className="aspect-video">
                {site.status === 'published' ? (
                  <iframe
                    src={`/sites/${site.slug}`}
                    className="w-full h-full border-0"
                    title="Site preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">Preview not available</div>
                      <div className="text-sm text-gray-400">Publish the site to see live preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
