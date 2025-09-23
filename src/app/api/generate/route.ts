import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { CreateSiteSchema } from '@/lib/types'
import { generateMarketingCopy } from '@/lib/openai'
import { extractColorsFromImage } from '@/lib/colors'
import { generateSlug } from '@/lib/utils'
import { renderTemplate as renderT1 } from '@/templates/t1'
import { renderTemplate as renderT2 } from '@/templates/t2'
import { renderTemplate as renderT3 } from '@/templates/t3'
import { renderTemplate as renderT4 } from '@/templates/t4'
import { renderTemplate as renderT5 } from '@/templates/t5'
import { renderTemplate as renderT6 } from '@/templates/t6'
import { renderTemplate as renderT7 } from '@/templates/t7/server'

const templateRenderers = {
  t1: renderT1,
  t2: renderT2,
  t3: renderT3,
  t4: renderT4,
  t5: renderT5,
  t6: renderT6,
  t7: renderT7,
}

export async function POST(request: NextRequest) {
  console.log('API /api/generate called')
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth check - User:', user?.id, 'Error:', authError)
    if (authError || !user) {
      console.log('Authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const validatedData = CreateSiteSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Get or create organization
    let { data: org } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_user_id', user.id)
      .single()

    if (!org) {
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          owner_user_id: user.id,
          name: `${user.email?.split('@')[0]}'s Organization`
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization creation error:', orgError)
        return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
      }
      org = newOrg
    }

    // Extract colors from logo if provided
    let colors = {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981'
    }

    if (validatedData.logoUrl) {
      try {
        colors = await extractColorsFromImage(validatedData.logoUrl)
      } catch (error) {
        console.warn('Color extraction failed, using defaults:', error)
      }
    }

    // Override with preferred colors if provided
    if (validatedData.preferredColors) {
      colors = {
        ...colors,
        ...validatedData.preferredColors
      }
    }

    // Generate marketing copy with OpenAI
    const copy = await generateMarketingCopy({
      brandName: validatedData.brandName,
      industry: validatedData.industry,
      description: validatedData.description
    })

    // Create brand configuration
    const brandConfig = {
      brandName: validatedData.brandName,
      logoUrl: validatedData.logoUrl || undefined,
      colors,
      copy: {
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta
      },
      industry: validatedData.industry,
      description: validatedData.description,
      ctaUrl: validatedData.ctaUrl,
    }

    // Render template based on selected templateId
    const renderer = templateRenderers[validatedData.templateId]
    const { html, css } = renderer(brandConfig)

    // Generate unique slug
    const slug = generateSlug(validatedData.brandName)

    // Save to database - map t7 to t6 for legacy constraint compatibility but use t7 renderer
    const dbTemplateId = validatedData.templateId === 't7' ? 't6' : validatedData.templateId
    
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .insert({
        org_id: org.id,
        slug,
        template_id: dbTemplateId,
        logo_url: validatedData.logoUrl,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        brand_name: validatedData.brandName,
        industry: validatedData.industry,
        description: validatedData.description,
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta,
        generated_html: html,
        generated_css: css,
        status: 'draft'
      })
      .select()
      .single()

    if (siteError) {
      console.error('Site creation error:', siteError)
      return NextResponse.json({ error: 'Failed to create site' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        site,
        slug
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
