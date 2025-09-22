'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateSiteSchema, CreateSiteFormData, INDUSTRIES, TemplateId } from '@/lib/types'
import { TemplateCard } from '@/components/TemplateCard'
import { TemplatePreviewModal } from '@/components/TemplatePreviewModal'
import { LogoUploader } from '@/components/LogoUploader'
import { Button } from '@/components/ui/button'

const templateList = [
  {
    id: 't1' as const,
    name: 'Minimal SaaS',
    description: 'Clean, professional design perfect for SaaS and tech companies',
    preview: '/templates/t1-preview.svg'
  },
  {
    id: 't2' as const,
    name: 'Bold Marketing',
    description: 'Eye-catching design with strong visual impact for marketing campaigns',
    preview: '/templates/t2-preview.svg'
  },
  {
    id: 't3' as const,
    name: 'Lead Generation',
    description: 'Conversion-focused design with prominent forms and CTAs',
    preview: '/templates/t3-preview.svg'
  },
  {
    id: 't4' as const,
    name: 'Casino Gaming',
    description: 'High-energy casino design with vibrant colors and gaming elements',
    preview: '/templates/t4-preview.svg'
  },
  {
    id: 't5' as const,
    name: 'iGaming Casino',
    description: 'Interactive casino slot machine with animated elements and gaming features',
    preview: '/templates/t5-preview.svg'
  },
  {
    id: 't6' as const,
    name: 'Olavivo Casino Slots',
    description: 'Interactive 3-line slot machine with animated symbols and casino atmosphere',
    preview: '/templates/t6-preview.svg'
  },
  {
    id: 't7' as const,
    name: 'Bonanza Billion',
    description: 'Premium slot machine template with interactive reels, jackpot animations, and billion-dollar theme',
    preview: '/templates/t7-preview.svg'
  }
]

export default function NewSitePage() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('t1')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateSiteFormData>({
    resolver: zodResolver(CreateSiteSchema),
    defaultValues: {
      templateId: 't1'
    }
  })

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId)
    setValue('templateId', templateId)
  }

  const handlePreview = (templateId: TemplateId) => {
    setPreviewTemplate(templateId)
    setIsPreviewOpen(true)
  }

  const handlePreviewSelect = (templateId: TemplateId) => {
    handleTemplateSelect(templateId)
  }

  const onSubmit = async (data: CreateSiteFormData) => {
    console.log('Form submission started with data:', data)
    console.log('Selected template:', selectedTemplate)
    console.log('Form errors:', errors)
    setGenerating(true)

    try {
      const payload = {
        ...data,
        templateId: selectedTemplate,
        logoUrl: logoUrl || undefined
      }
      console.log('Sending payload:', payload)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        router.push(`/dashboard/site/${result.data.site.id}`)
      } else {
        console.error('Generation failed:', result.error)
        alert(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Request failed:', error)
      alert('Generation failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setGenerating(false)
    }
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Site</h1>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      i <= step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  } ${i > 1 ? 'mx-2' : ''}`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div
                    className={`flex-1 h-1 ${
                      i < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <span className="mt-2 text-sm text-gray-600 text-center">
                {i === 1 && 'Choose Template'}
                {i === 2 && 'Upload Logo'}
                {i === 3 && 'Brand Details'}
                {i === 4 && 'Generate'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Choose Template */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Choose Your Template</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {templateList.map((template) => (
                    <TemplateCard
                      key={template.id}
                      {...template}
                      selected={selectedTemplate === template.id}
                      onSelect={handleTemplateSelect}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Logo */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload Your Logo</h2>
                <LogoUploader onUpload={setLogoUrl} currentUrl={logoUrl} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  {logoUrl ? 'Next' : 'Skip for now'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Brand Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Tell Us About Your Brand</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      {...register('brandName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company or brand name"
                    />
                    {errors.brandName && (
                      <p className="text-red-600 text-sm mt-1">{errors.brandName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry *
                    </label>
                    <select
                      {...register('industry')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="text-red-600 text-sm mt-1">{errors.industry.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        id="description"
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your business, products, or services..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Call-to-Action URL (Optional)
                      </label>
                      <input
                        type="url"
                        id="ctaUrl"
                        {...register('ctaUrl')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/signup"
                      />
                      {errors.ctaUrl && (
                        <p className="mt-1 text-sm text-red-600">{errors.ctaUrl.message}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Where should the main button link to? Leave empty for demo mode.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Ready to Generate</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-medium mb-4">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span>{templateList.find(t => t.id === selectedTemplate)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand Name:</span>
                      <span>{watch('brandName')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span>{watch('industry')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Logo:</span>
                      <span>{logoUrl ? 'Uploaded' : 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  type="button" 
                  disabled={generating}
                  onClick={(e) => {
                    console.log('Generate button clicked')
                    console.log('Current form values:', watch())
                    console.log('Selected template:', selectedTemplate)
                    handleSubmit(onSubmit)(e)
                  }}
                >
                  {generating ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Template Preview Modal */}
        <TemplatePreviewModal
          templateId={previewTemplate}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onSelect={handlePreviewSelect}
        />
      </main>
    </div>
  )
}
