import { z } from 'zod'

// Database types
export interface Organization {
  id: string
  owner_user_id: string
  name: string
  created_at: string
}

export type TemplateId = 't1' | 't2' | 't3' | 't4' | 't5' | 't6' | 't7'

export interface Site {
  id: string
  org_id: string
  slug: string
  template_id: TemplateId
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  brand_name?: string
  industry?: string
  description?: string
  headline?: string
  subheadline?: string
  cta?: string
  generated_html?: string
  generated_css?: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface Visit {
  id: string
  site_id: string
  ts: string
  source?: string
  user_agent?: string
}

// Brand configuration
export interface BrandConfig {
  brandName: string
  logoUrl?: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  copy: {
    headline: string
    subheadline: string
    cta: string
  }
  industry?: string
  description?: string
  ctaUrl?: string
}

// Template render result
export interface TemplateRenderResult {
  html: string
  css: string
}

// Zod schemas for validation
export const CreateSiteSchema = z.object({
  templateId: z.enum(['t1', 't2', 't3', 't4', 't5', 't6', 't7']),
  brandName: z.string().min(1, 'Brand name is required'),
  industry: z.string().min(1, 'Industry is required'),
  logoUrl: z.string().nullable().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ctaUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  preferredColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
})

export const OpenAIResponseSchema = z.object({
  headline: z.string().max(100, 'Headline too long'),
  subheadline: z.string().max(200, 'Subheadline too long'),
  cta: z.string().max(50, 'CTA too long'),
  seo_keywords: z.array(z.string()).max(6, 'Too many keywords'),
})

export const ColorPaletteSchema = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
})

// Form types
export type CreateSiteFormData = z.infer<typeof CreateSiteSchema>
export type OpenAIResponse = z.infer<typeof OpenAIResponseSchema>
export type ColorPalette = z.infer<typeof ColorPaletteSchema>

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface SiteGenerationResponse {
  site: Site
  slug: string
}

// Template types
export interface TemplateProps {
  brand: BrandConfig
}

export interface TemplateDefinition {
  id: TemplateId
  name: string
  description: string
  preview: string
  component: React.ComponentType<TemplateProps>
  renderTemplate: (brand: BrandConfig) => TemplateRenderResult
}

// Industries list
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Real Estate',
  'Food & Beverage',
  'Travel & Tourism',
  'Fitness & Wellness',
  'Entertainment',
  'Professional Services',
  'Non-profit',
  'Casino & Gaming',
  'Other'
] as const

export type Industry = typeof INDUSTRIES[number]
