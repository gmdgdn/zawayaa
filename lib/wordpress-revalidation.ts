/**
 * WordPress Revalidation Utilities
 * Helper functions for triggering cache revalidation from WordPress webhooks
 */

// Revalidation configuration
const REVALIDATION_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`
    : '/api/revalidate',
  secret: process.env.REVALIDATION_SECRET || 'zawaya-revalidate-secret-2024'
}

// WordPress post status mapping
const WP_STATUS_TO_ACTION: Record<string, string> = {
  'publish': 'publish',
  'draft': 'update',
  'private': 'update',
  'trash': 'delete',
  'auto-draft': 'update'
}

// Content type mapping from WordPress
const WP_POST_TYPE_MAPPING: Record<string, string> = {
  'post': 'post',
  'program': 'program', 
  'episode': 'episode',
  'user': 'user',
  'category': 'category'
}

/**
 * Trigger revalidation for WordPress content changes
 */
export async function triggerWordPressRevalidation(params: {
  postType: string
  postId: number
  postSlug?: string
  postStatus?: string
  action?: string
  cascade?: boolean
  customPaths?: string[]
  customTags?: string[]
}): Promise<boolean> {
  try {
    const {
      postType,
      postId,
      postSlug,
      postStatus = 'publish',
      action,
      cascade = true,
      customPaths = [],
      customTags = []
    } = params

    // Determine action from post status if not provided
    const revalidationAction = action || WP_STATUS_TO_ACTION[postStatus] || 'update'
    
    // Map WordPress post type to our content type
    const contentType = WP_POST_TYPE_MAPPING[postType] || 'post'

    // Prepare revalidation payload
    const payload = {
      secret: REVALIDATION_CONFIG.secret,
      content_type: contentType,
      content_id: postId,
      content_slug: postSlug,
      action: revalidationAction,
      cascade,
      paths: customPaths.length > 0 ? customPaths : undefined,
      tags: customTags.length > 0 ? customTags : undefined
    }

    console.log('Triggering WordPress revalidation:', payload)

    // Make revalidation request
    const response = await fetch(REVALIDATION_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('WordPress revalidation successful:', result)
      return true
    } else {
      const error = await response.text()
      console.error('WordPress revalidation failed:', response.status, error)
      return false
    }
  } catch (error) {
    console.error('WordPress revalidation error:', error)
    return false
  }
}

/**
 * Trigger revalidation for featured content changes
 */
export async function triggerFeaturedContentRevalidation(params: {
  contentType: 'post' | 'program' | 'author'
  contentId: number
  contentSlug?: string
  isFeatured: boolean
}): Promise<boolean> {
  return triggerWordPressRevalidation({
    postType: params.contentType,
    postId: params.contentId,
    postSlug: params.contentSlug,
    action: 'featured_toggle',
    cascade: true,
    // Always revalidate homepage for featured content changes
    customPaths: ['/ar'],
    customTags: ['homepage', 'featured']
  })
}

/**
 * Trigger emergency cache clear
 */
export async function triggerEmergencyCacheClear(): Promise<boolean> {
  try {
    const payload = {
      secret: REVALIDATION_CONFIG.secret,
      action: 'emergency_clear'
    }

    const response = await fetch(REVALIDATION_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log('Emergency cache clear successful')
      return true
    } else {
      console.error('Emergency cache clear failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('Emergency cache clear error:', error)
    return false
  }
}

/**
 * Batch revalidation for multiple content items
 */
export async function triggerBatchRevalidation(items: Array<{
  postType: string
  postId: number
  postSlug?: string
  postStatus?: string
}>): Promise<boolean> {
  try {
    // Group items by content type for efficient revalidation
    const groupedItems = items.reduce((acc, item) => {
      const contentType = WP_POST_TYPE_MAPPING[item.postType] || 'post'
      if (!acc[contentType]) {
        acc[contentType] = []
      }
      acc[contentType].push(item)
      return acc
    }, {} as Record<string, typeof items>)

    // Trigger revalidation for each content type group
    const results = await Promise.all(
      Object.entries(groupedItems).map(async ([contentType, contentItems]) => {
        // For batch operations, we'll revalidate the entire content type
        const payload = {
          secret: REVALIDATION_CONFIG.secret,
          tags: [contentType === 'post' ? 'articles' : contentType],
          cascade: true
        }

        const response = await fetch(REVALIDATION_CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        return response.ok
      })
    )

    const success = results.every(result => result)
    console.log(`Batch revalidation ${success ? 'successful' : 'failed'} for ${items.length} items`)
    return success
  } catch (error) {
    console.error('Batch revalidation error:', error)
    return false
  }
}

/**
 * Test revalidation endpoint
 */
export async function testRevalidationEndpoint(): Promise<boolean> {
  try {
    const response = await fetch(`${REVALIDATION_CONFIG.endpoint}?secret=${REVALIDATION_CONFIG.secret}`, {
      method: 'GET'
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Revalidation endpoint test successful:', result)
      return true
    } else {
      console.error('Revalidation endpoint test failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('Revalidation endpoint test error:', error)
    return false
  }
}

// Export configuration for WordPress plugin use
export const WORDPRESS_REVALIDATION_CONFIG = {
  endpoint: REVALIDATION_CONFIG.endpoint,
  // Don't expose the secret in client-side code
  hasSecret: !!REVALIDATION_CONFIG.secret,
  supportedActions: Object.keys(WP_STATUS_TO_ACTION),
  supportedContentTypes: Object.keys(WP_POST_TYPE_MAPPING)
}