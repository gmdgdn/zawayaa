/**
 * Program and Episode SCF Integration
 * Complete integration layer for program and episode SCF fields with WordPress
 */

import { 
  ProgramCardProps, 
  ProgramDetailProps, 
  EpisodeCardProps,
  EpisodeDetailProps,
  transformToProgramCard,
  transformToProgramDetail,
  transformToEpisodeCard,
  transformToEpisodeDetail,
  transformToProgramCards,
  transformToEpisodeCards,
  validateProgramSCF,
  validateEpisodeSCF,
  getProgramCacheTags,
  getEpisodeCacheTags,
  getProgramRevalidationPaths,
  getEpisodeRevalidationPaths
} from './scf-mappings/program-mappings'
import { NormalizedWPPost, transformWordPressPosts } from './wordpress-transformers'
import { wpGet, type WPPost } from './wordpress'

// Program fetching options
export interface ProgramFetchOptions {
  page?: number
  perPage?: number
  type?: 'video' | 'audio' | 'mixed'
  orderBy?: 'date' | 'title' | 'modified'
  order?: 'asc' | 'desc'
}

// Episode fetching options
export interface EpisodeFetchOptions {
  page?: number
  perPage?: number
  programId?: number
  seasonNumber?: number
  orderBy?: 'date' | 'episode_number' | 'title'
  order?: 'asc' | 'desc'
}

/**
 * Fetch programs with complete SCF mapping
 */
export async function fetchProgramsWithSCF(
  options: ProgramFetchOptions = {}
): Promise<{
  programs: ProgramCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const {
    page = 1,
    perPage = 12,
    type,
    orderBy = 'date',
    order = 'desc'
  } = options

  // Build WordPress API parameters
  const params: Record<string, any> = {
    page,
    per_page: perPage,
    orderby: orderBy,
    order,
    _embed: true,
    acf_format: 'standard'
  }

  if (type) {
    params.meta_query = JSON.stringify([
      {
        key: 'program_type',
        value: type,
        compare: '='
      }
    ])
  }

  try {
    // Fetch programs from WordPress
    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('programs', params, {
      revalidate: 300, // 5 minutes
      tags: ['programs']
    })

    // Transform to normalized format
    const normalizedPrograms = transformWordPressPosts(response.data || [])
    
    // Transform to program cards
    const programs = transformToProgramCards(normalizedPrograms)
    
    // Calculate pagination
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : programs.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    // Generate cache tags
    const cacheTags = ['programs']
    if (type) cacheTags.push(`program-type:${type}`)

    return {
      programs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      cacheTags
    }

  } catch (error) {
    console.error('Error fetching programs with SCF:', error)
    
    return {
      programs: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['programs']
    }
  }
}

/**
 * Fetch single program with complete SCF mapping
 */
export async function fetchProgramWithSCF(
  slug: string
): Promise<{
  program: ProgramDetailProps | null
  cacheTags: string[]
  revalidationPaths: string[]
}> {
  try {
    // Fetch single program by slug
    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('programs', {
      slug,
      _embed: true,
      acf_format: 'standard'
    }, {
      revalidate: 300, // 5 minutes
      tags: ['programs', `program-slug:${slug}`]
    })

    if (!response.data || response.data.length === 0) {
      return {
        program: null,
        cacheTags: ['programs'],
        revalidationPaths: []
      }
    }

    // Transform to normalized format
    const normalizedProgram = transformWordPressPosts(response.data)[0]
    
    // Validate SCF fields
    const validation = validateProgramSCF(normalizedProgram.zawaya_meta)
    if (!validation.valid) {
      console.warn('Program SCF validation failed:', validation.errors)
    }
    if (validation.warnings.length > 0) {
      console.warn('Program SCF warnings:', validation.warnings)
    }
    
    // Fetch episodes for this program
    const episodes = await fetchEpisodesForProgram(normalizedProgram.id)
    
    // Transform to program detail
    const program = transformToProgramDetail(normalizedProgram, episodes)
    
    // Generate cache tags and revalidation paths
    const cacheTags = getProgramCacheTags(normalizedProgram)
    const revalidationPaths = getProgramRevalidationPaths(normalizedProgram)

    return {
      program,
      cacheTags,
      revalidationPaths
    }

  } catch (error) {
    console.error('Error fetching program with SCF:', error)
    
    return {
      program: null,
      cacheTags: ['programs'],
      revalidationPaths: []
    }
  }
}

/**
 * Fetch episodes for a specific program
 */
export async function fetchEpisodesForProgram(
  programId: number,
  options: Omit<EpisodeFetchOptions, 'programId'> = {}
): Promise<NormalizedWPPost[]> {
  const {
    page = 1,
    perPage = 50,
    seasonNumber,
    orderBy = 'episode_number',
    order = 'asc'
  } = options

  try {
    const params: Record<string, any> = {
      page,
      per_page: perPage,
      orderby: orderBy,
      order,
      _embed: true,
      acf_format: 'standard',
      meta_query: JSON.stringify([
        {
          key: 'program_reference',
          value: programId.toString(),
          compare: '='
        }
      ])
    }

    if (seasonNumber) {
      params.meta_query = JSON.stringify([
        {
          key: 'program_reference',
          value: programId.toString(),
          compare: '='
        },
        {
          key: 'season_number',
          value: seasonNumber.toString(),
          compare: '='
        }
      ])
    }

    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('episodes', params, {
      revalidate: 300,
      tags: ['episodes', `program:${programId}`]
    })

    return transformWordPressPosts(response.data || [])

  } catch (error) {
    console.error('Error fetching episodes for program:', error)
    return []
  }
}

/**
 * Fetch episodes with complete SCF mapping
 */
export async function fetchEpisodesWithSCF(
  options: EpisodeFetchOptions = {}
): Promise<{
  episodes: EpisodeCardProps[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const {
    page = 1,
    perPage = 12,
    programId,
    seasonNumber,
    orderBy = 'date',
    order = 'desc'
  } = options

  const params: Record<string, any> = {
    page,
    per_page: perPage,
    orderby: orderBy,
    order,
    _embed: true,
    acf_format: 'standard'
  }

  // Build meta query for filtering
  const metaQuery: any[] = []
  
  if (programId) {
    metaQuery.push({
      key: 'program_reference',
      value: programId.toString(),
      compare: '='
    })
  }

  if (seasonNumber) {
    metaQuery.push({
      key: 'season_number',
      value: seasonNumber.toString(),
      compare: '='
    })
  }

  if (metaQuery.length > 0) {
    params.meta_query = JSON.stringify(metaQuery)
  }

  try {
    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('episodes', params, {
      revalidate: 300,
      tags: ['episodes']
    })

    const normalizedEpisodes = transformWordPressPosts(response.data || [])
    const episodes = transformToEpisodeCards(normalizedEpisodes)
    
    const totalItems = response.headers?.['x-wp-total'] ? 
      parseInt(response.headers['x-wp-total']) : episodes.length
    const totalPages = response.headers?.['x-wp-totalpages'] ? 
      parseInt(response.headers['x-wp-totalpages']) : 1

    const cacheTags = ['episodes']
    if (programId) cacheTags.push(`program:${programId}`)

    return {
      episodes,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      cacheTags
    }

  } catch (error) {
    console.error('Error fetching episodes with SCF:', error)
    
    return {
      episodes: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      },
      cacheTags: ['episodes']
    }
  }
}

/**
 * Fetch single episode with complete SCF mapping
 */
export async function fetchEpisodeWithSCF(
  slug: string
): Promise<{
  episode: EpisodeDetailProps | null
  program: ProgramCardProps | null
  cacheTags: string[]
  revalidationPaths: string[]
}> {
  try {
    // Fetch single episode by slug
    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('episodes', {
      slug,
      _embed: true,
      acf_format: 'standard'
    }, {
      revalidate: 300, // 5 minutes
      tags: ['episodes', `episode-slug:${slug}`]
    })

    if (!response.data || response.data.length === 0) {
      return {
        episode: null,
        program: null,
        cacheTags: ['episodes'],
        revalidationPaths: []
      }
    }

    const normalizedEpisode = transformWordPressPosts(response.data)[0]
    
    // Validate SCF fields
    const validation = validateEpisodeSCF(normalizedEpisode.zawaya_meta)
    if (!validation.valid) {
      console.warn('Episode SCF validation failed:', validation.errors)
    }
    if (validation.warnings.length > 0) {
      console.warn('Episode SCF warnings:', validation.warnings)
    }
    
    // Fetch parent program if reference exists
    let program: ProgramCardProps | null = null
    let normalizedProgram: NormalizedWPPost | undefined
    
    if (normalizedEpisode.zawaya_meta.program_reference) {
      try {
        const programResponse = await wpGet<{data: WPPost[], headers: Record<string, string>}>('programs', {
          include: [normalizedEpisode.zawaya_meta.program_reference],
          _embed: true,
          acf_format: 'standard'
        })
        
        if (programResponse.data && programResponse.data.length > 0) {
          normalizedProgram = transformWordPressPosts(programResponse.data)[0]
          program = transformToProgramCard(normalizedProgram)
        }
      } catch (error) {
        console.warn('Failed to fetch parent program:', error)
      }
    }
    
    // Transform to episode detail
    const episode = transformToEpisodeDetail(normalizedEpisode, normalizedProgram)
    
    // Generate cache tags and revalidation paths
    const cacheTags = getEpisodeCacheTags(normalizedEpisode, normalizedProgram?.id)
    const revalidationPaths = getEpisodeRevalidationPaths(normalizedEpisode, normalizedProgram?.slug)

    return {
      episode,
      program,
      cacheTags,
      revalidationPaths
    }

  } catch (error) {
    console.error('Error fetching episode with SCF:', error)
    
    return {
      episode: null,
      program: null,
      cacheTags: ['episodes'],
      revalidationPaths: []
    }
  }
}

/**
 * Fetch programs by type (video, audio, mixed)
 */
export async function fetchProgramsByTypeWithSCF(
  type: 'video' | 'audio' | 'mixed',
  options: Omit<ProgramFetchOptions, 'type'> = {}
): Promise<{
  programs: ProgramCardProps[]
  type: string
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  cacheTags: string[]
}> {
  const result = await fetchProgramsWithSCF({
    ...options,
    type
  })

  return {
    ...result,
    type,
    cacheTags: [...result.cacheTags, `program-type:${type}`]
  }
}

/**
 * Fetch latest episodes across all programs
 */
export async function fetchLatestEpisodesWithSCF(
  limit: number = 6
): Promise<{
  episodes: EpisodeCardProps[]
  cacheTags: string[]
}> {
  try {
    const response = await wpGet<{data: WPPost[], headers: Record<string, string>}>('episodes', {
      per_page: limit,
      orderby: 'date',
      order: 'desc',
      _embed: true,
      acf_format: 'standard'
    }, {
      revalidate: 180, // 3 minutes
      tags: ['episodes', 'latest-episodes']
    })

    const normalizedEpisodes = transformWordPressPosts(response.data || [])
    const episodes = transformToEpisodeCards(normalizedEpisodes)

    return {
      episodes,
      cacheTags: ['episodes', 'latest-episodes']
    }

  } catch (error) {
    console.error('Error fetching latest episodes:', error)
    
    return {
      episodes: [],
      cacheTags: ['episodes', 'latest-episodes']
    }
  }
}

/**
 * Search programs and episodes
 */
export async function searchProgramsAndEpisodesWithSCF(
  query: string,
  options: { 
    includePrograms?: boolean
    includeEpisodes?: boolean
    limit?: number 
  } = {}
): Promise<{
  programs: ProgramCardProps[]
  episodes: EpisodeCardProps[]
  query: string
  cacheTags: string[]
}> {
  const { includePrograms = true, includeEpisodes = true, limit = 10 } = options
  
  const results = {
    programs: [] as ProgramCardProps[],
    episodes: [] as EpisodeCardProps[],
    query,
    cacheTags: ['search']
  }

  try {
    const promises: Promise<any>[] = []

    if (includePrograms) {
      promises.push(
        wpGet('programs', {
          search: query,
          per_page: limit,
          _embed: true,
          acf_format: 'standard'
        })
      )
    }

    if (includeEpisodes) {
      promises.push(
        wpGet('episodes', {
          search: query,
          per_page: limit,
          _embed: true,
          acf_format: 'standard'
        })
      )
    }

    const responses = await Promise.all(promises) as Array<{data: WPPost[], headers: Record<string, string>}>
    
    if (includePrograms && responses[0]) {
      const normalizedPrograms = transformWordPressPosts(responses[0].data || [])
      results.programs = transformToProgramCards(normalizedPrograms)
    }

    if (includeEpisodes) {
      const episodeResponse = includePrograms ? responses[1] : responses[0]
      if (episodeResponse) {
        const normalizedEpisodes = transformWordPressPosts(episodeResponse.data || [])
        results.episodes = transformToEpisodeCards(normalizedEpisodes)
      }
    }

  } catch (error) {
    console.error('Error searching programs and episodes:', error)
  }

  return results
}
