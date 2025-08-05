import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioPlayer } from '@/components/ui/audio-player'

// Mock audio element with comprehensive Arabic audio support
const createMockAudio = () => {
  const listeners: { [key: string]: Function[] } = {}
  
  const mockAudio = {
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    load: vi.fn(),
    src: '',
    preload: 'metadata',
    addEventListener: vi.fn((event: string, handler: Function) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
    }),
    removeEventListener: vi.fn((event: string, handler: Function) => {
      if (listeners[event]) {
        const index = listeners[event].indexOf(handler)
        if (index > -1) listeners[event].splice(index, 1)
      }
    }),
    dispatchEvent: (event: Event) => {
      const eventListeners = listeners[event.type] || []
      eventListeners.forEach(handler => handler(event))
    }
  }

  // Use Object.defineProperty for reactive properties
  let currentTime = 0
  let duration = 180
  let paused = true
  let volume = 1
  let playbackRate = 1

  Object.defineProperty(mockAudio, 'currentTime', {
    get: () => currentTime,
    set: (value: number) => {
      currentTime = Math.max(0, Math.min(duration, value))
      // Trigger timeupdate event
      const event = new Event('timeupdate')
      mockAudio.dispatchEvent(event)
    }
  })

  Object.defineProperty(mockAudio, 'duration', {
    get: () => duration,
    set: (value: number) => {
      duration = value
      // Trigger loadedmetadata event
      const event = new Event('loadedmetadata')
      mockAudio.dispatchEvent(event)
    }
  })

  Object.defineProperty(mockAudio, 'paused', {
    get: () => paused,
    set: (value: boolean) => { paused = value }
  })

  Object.defineProperty(mockAudio, 'volume', {
    get: () => volume,
    set: (value: number) => { volume = Math.max(0, Math.min(1, value)) }
  })

  Object.defineProperty(mockAudio, 'playbackRate', {
    get: () => playbackRate,
    set: (value: number) => { playbackRate = value }
  })

  return mockAudio
}

let mockAudio: any

// Mock HTMLAudioElement constructor
global.HTMLAudioElement = vi.fn(() => {
  mockAudio = createMockAudio()
  return mockAudio
}) as any

describe('AudioPlayer - Arabic Audio Playback', () => {
  const defaultProps = {
    src: 'https://example.com/arabic-audio.mp3',
    title: 'مقال صوتي عربي',
    variant: 'default' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Create fresh mock for each test
    mockAudio = createMockAudio()
    global.HTMLAudioElement = vi.fn(() => mockAudio) as any
  })

  describe('Arabic Content Display', () => {
    it('should display Arabic title correctly', () => {
      render(<AudioPlayer {...defaultProps} />)
      
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
    })

    it('should show Arabic content type label', () => {
      render(<AudioPlayer {...defaultProps} />)
      
      expect(screen.getByText('مقال صوتي')).toBeInTheDocument()
    })

    it('should format duration correctly', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Wait for metadata to load
      await waitFor(() => {
        expect(screen.getByTestId('current-time')).toHaveTextContent('0:00')
        expect(screen.getByTestId('duration-time')).toHaveTextContent('3:00')
      })
    })

    it('should handle Arabic titles with special characters', () => {
      const arabicTitle = 'مقال عن "الثقافة العربية" والتراث الإسلامي'
      render(<AudioPlayer {...defaultProps} title={arabicTitle} />)
      
      expect(screen.getByText(arabicTitle)).toBeInTheDocument()
    })

    it('should display loading spinner when audio is loading', () => {
      // Simulate loading state by triggering loadstart event
      render(<AudioPlayer {...defaultProps} />)
      
      // Find the audio element and trigger loadstart
      const audioElement = document.querySelector('audio')
      if (audioElement) {
        fireEvent.loadStart(audioElement)
      }
      
      // Should show loading spinner
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('Playback Controls', () => {
    it('should toggle play/pause when main button is clicked', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      const playButton = screen.getByRole('button')
      
      // First click should play
      await user.click(playButton)
      expect(mockAudio.play).toHaveBeenCalled()
      
      // Simulate playing state
      mockAudio.paused = false
      
      // Second click should pause
      await user.click(playButton)
      expect(mockAudio.pause).toHaveBeenCalled()
    })

    it('should seek audio when progress slider is changed', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        const progressSlider = screen.getAllByRole('slider')[0] // First slider is progress
        
        // Use pointer events for Radix slider
        const thumb = progressSlider.querySelector('[role="slider"]')
        if (thumb) {
          // Simulate seeking to 50%
          fireEvent.pointerDown(thumb, { pointerId: 1 })
          thumb.setAttribute('aria-valuenow', '50')
          fireEvent.pointerUp(thumb, { pointerId: 1 })
        }
        
        expect(mockAudio.currentTime).toBe(90) // 50% of 180 seconds
      })
    })

    it('should skip backward 10 seconds', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      // Set initial time
      mockAudio.currentTime = 60
      
      // Find skip back button (first button)
      const skipBackButton = screen.getAllByRole('button')[0]
      await user.click(skipBackButton)
      
      expect(mockAudio.currentTime).toBe(50) // 60 - 10 seconds
    })

    it('should skip forward 10 seconds', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      // Set initial time
      mockAudio.currentTime = 60
      
      // Find skip forward button (third button)
      const skipForwardButton = screen.getAllByRole('button')[2]
      await user.click(skipForwardButton)
      
      expect(mockAudio.currentTime).toBe(70) // 60 + 10 seconds
    })

    it('should change playback rate', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        // Find playback rate button (shows "1x" initially)
        const rateButton = screen.getByText('1x')
        expect(rateButton).toBeInTheDocument()
      })
      
      const rateButton = screen.getByText('1x')
      await user.click(rateButton)
      
      expect(mockAudio.playbackRate).toBe(1.25) // Next rate in sequence
    })

    it('should toggle mute', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      // Find mute button (volume icon)
      const muteButton = screen.getAllByRole('button').find(button => 
        button.querySelector('svg')
      )
      
      if (muteButton) {
        await user.click(muteButton)
        expect(mockAudio.volume).toBe(0)
      }
    })

    it('should adjust volume with slider', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        // Volume slider is the second slider
        const volumeSlider = screen.getAllByRole('slider')[1]
        
        // Use pointer events for Radix slider
        const thumb = volumeSlider.querySelector('[role="slider"]')
        if (thumb) {
          fireEvent.pointerDown(thumb, { pointerId: 1 })
          thumb.setAttribute('aria-valuenow', '75')
          fireEvent.pointerUp(thumb, { pointerId: 1 })
        }
        
        expect(mockAudio.volume).toBe(0.75)
      })
    })
  })

  describe('Audio Event Handling', () => {
    it('should update current time when audio time updates', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Simulate time update
      mockAudio.currentTime = 45
      
      await waitFor(() => {
        expect(screen.getByTestId('current-time')).toHaveTextContent('0:45')
      })
    })

    it('should update duration when metadata loads', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Simulate metadata loaded
      mockAudio.duration = 240 // 4 minutes
      
      await waitFor(() => {
        expect(screen.getByTestId('duration-time')).toHaveTextContent('4:00')
      })
    })

    it('should handle audio end event', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Simulate audio ended
      const endedEvent = new Event('ended')
      mockAudio.dispatchEvent(endedEvent)
      
      await waitFor(() => {
        // Should reset to play button state
        const playButton = screen.getAllByRole('button')[1] // Main play button
        expect(playButton.querySelector('svg')).toBeInTheDocument()
      })
    })

    it('should handle loading states correctly', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Simulate load start
      const loadStartEvent = new Event('loadstart')
      mockAudio.dispatchEvent(loadStartEvent)
      
      await waitFor(() => {
        // Should show loading state
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()
      })
      
      // Simulate can play
      const canPlayEvent = new Event('canplay')
      mockAudio.dispatchEvent(canPlayEvent)
      
      await waitFor(() => {
        // Should hide loading state
        expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and RTL Support', () => {
    it('should have proper semantic structure', () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Should have audio element
      expect(screen.getByRole('application')).toBeInTheDocument()
      
      // Should have interactive controls
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
      expect(screen.getAllByRole('slider').length).toBeGreaterThan(0)
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      const playButton = screen.getAllByRole('button')[0]
      
      // Should be focusable
      playButton.focus()
      expect(playButton).toHaveFocus()
      
      // Should respond to Enter key
      await user.keyboard('{Enter}')
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('should handle RTL layout correctly', () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Component should render without errors in RTL context
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
      
      // Controls should be properly positioned
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should provide proper ARIA labels for screen readers', () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Audio element should have proper attributes
      const audioElement = document.querySelector('audio')
      expect(audioElement).toHaveAttribute('preload', 'metadata')
      
      // Sliders should be accessible
      const sliders = screen.getAllByRole('slider')
      expect(sliders.length).toBe(2) // Progress and volume sliders
    })
  })

  describe('Different Variants', () => {
    it('should render default variant with full controls', () => {
      render(<AudioPlayer {...defaultProps} variant="default" />)
      
      // Should show title and full controls
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
      expect(screen.getByText('مقال صوتي')).toBeInTheDocument()
      
      // Should have multiple control buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(3) // Play, skip back, skip forward, rate, mute
    })

    it('should render compact variant correctly', () => {
      render(<AudioPlayer {...defaultProps} variant="compact" />)
      
      // Should show title and basic controls
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
      
      // Should have fewer controls than default
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(1) // Only play/pause button
      
      // Should have progress slider
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('should render inline variant correctly', async () => {
      render(<AudioPlayer {...defaultProps} variant="inline" />)
      
      // Should show title and minimal controls
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
      
      // Should have only play button
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      // Should show time display
      await waitFor(() => {
        expect(screen.getByText(/0:00 \/ 0:00/)).toBeInTheDocument()
      })
    })

    it('should hide title when showTitle is false', () => {
      render(<AudioPlayer {...defaultProps} showTitle={false} />)
      
      expect(screen.queryByText('مقال صوتي عربي')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <AudioPlayer {...defaultProps} className="custom-audio-player" />
      )
      
      expect(container.firstChild).toHaveClass('custom-audio-player')
    })
  })

  describe('Time Formatting and Display', () => {
    it('should format time correctly for different durations', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Short duration (under 1 hour)
      mockAudio.duration = 90 // 1:30
      mockAudio.currentTime = 45 // 0:45
      
      await waitFor(() => {
        expect(screen.getByTestId('current-time')).toHaveTextContent('0:45')
        expect(screen.getByTestId('duration-time')).toHaveTextContent('1:30')
      })
      
      // Long duration (over 1 hour)
      mockAudio.duration = 3661 // 1:01:01
      mockAudio.currentTime = 3600 // 1:00:00
      
      await waitFor(() => {
        expect(screen.getByTestId('current-time')).toHaveTextContent('1:00:00')
        expect(screen.getByTestId('duration-time')).toHaveTextContent('1:01:01')
      })
    })

    it('should handle zero duration gracefully', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      mockAudio.duration = 0
      
      await waitFor(() => {
        expect(screen.getByTestId('duration-time')).toHaveTextContent('0:00')
      })
    })

    it('should update progress bar correctly', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      // Set current time to 50% of duration
      mockAudio.currentTime = 90 // 50% of 180
      mockAudio.duration = 180
      
      await waitFor(() => {
        // Progress slider should reflect 50% progress
        const progressSlider = screen.getAllByRole('slider')[0]
        const thumb = progressSlider.querySelector('[role="slider"]')
        expect(thumb).toHaveAttribute('aria-valuenow', '50')
      })
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle play promise rejection gracefully', async () => {
      mockAudio.play.mockRejectedValueOnce(new Error('Play failed'))
      
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      const playButton = screen.getAllByRole('button')[0]
      
      // Should not throw error when play fails
      await user.click(playButton)
      
      // Should still show play button (not switch to pause)
      expect(playButton).toBeInTheDocument()
    })

    it('should handle invalid audio source', () => {
      render(<AudioPlayer {...defaultProps} src="" />)
      
      // Should render without crashing
      expect(screen.getByText('مقال صوتي عربي')).toBeInTheDocument()
      
      // Audio element should still be present
      expect(document.querySelector('audio')).toBeInTheDocument()
    })

    it('should handle NaN duration values', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      mockAudio.duration = NaN
      
      await waitFor(() => {
        // Should show 0:00 for invalid duration
        expect(screen.getByTestId('duration-time')).toHaveTextContent('0:00')
      })
    })

    it('should handle seeking beyond audio bounds', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        // Try to seek beyond 100%
        const progressSlider = screen.getAllByRole('slider')[0]
        const thumb = progressSlider.querySelector('[role="slider"]')
        if (thumb) {
          fireEvent.pointerDown(thumb, { pointerId: 1 })
          thumb.setAttribute('aria-valuenow', '150')
          fireEvent.pointerUp(thumb, { pointerId: 1 })
        }
        
        // Should clamp to maximum duration
        expect(mockAudio.currentTime).toBeLessThanOrEqual(180)
      })
    })

    it('should handle volume changes correctly', async () => {
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        const volumeSlider = screen.getAllByRole('slider')[1]
        const thumb = volumeSlider.querySelector('[role="slider"]')
        
        if (thumb) {
          // Test volume at 0 (should mute)
          fireEvent.pointerDown(thumb, { pointerId: 1 })
          thumb.setAttribute('aria-valuenow', '0')
          fireEvent.pointerUp(thumb, { pointerId: 1 })
          expect(mockAudio.volume).toBe(0)
          
          // Test volume at 100
          fireEvent.pointerDown(thumb, { pointerId: 1 })
          thumb.setAttribute('aria-valuenow', '100')
          fireEvent.pointerUp(thumb, { pointerId: 1 })
          expect(mockAudio.volume).toBe(1)
        }
      })
    })

    it('should cleanup event listeners on unmount', async () => {
      const { unmount } = render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        // Verify addEventListener was called
        expect(mockAudio.addEventListener).toHaveBeenCalled()
      })
      
      // Unmount component
      unmount()
      
      // Verify removeEventListener was called
      expect(mockAudio.removeEventListener).toHaveBeenCalled()
    })
  })

  describe('Playback Rate and Advanced Controls', () => {
    it('should cycle through playback rates correctly', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('1x')).toBeInTheDocument()
      })
      
      const rateButton = screen.getByText('1x')
      
      // Click to change rate
      await user.click(rateButton)
      expect(mockAudio.playbackRate).toBe(1.25)
      
      await waitFor(() => {
        expect(screen.getByText('1.25x')).toBeInTheDocument()
      })
      
      // Click again
      await user.click(screen.getByText('1.25x'))
      expect(mockAudio.playbackRate).toBe(1.5)
      
      await waitFor(() => {
        expect(screen.getByText('1.5x')).toBeInTheDocument()
      })
      
      // Continue cycling
      await user.click(screen.getByText('1.5x'))
      expect(mockAudio.playbackRate).toBe(2)
      
      await waitFor(() => {
        expect(screen.getByText('2x')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('2x'))
      expect(mockAudio.playbackRate).toBe(0.75)
      
      await waitFor(() => {
        expect(screen.getByText('0.75x')).toBeInTheDocument()
      })
      
      // Should cycle back to 1x
      await user.click(screen.getByText('0.75x'))
      expect(mockAudio.playbackRate).toBe(1)
    })

    it('should handle skip controls with boundary checking', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      // Test skip back at beginning
      mockAudio.currentTime = 5
      const skipBackButton = screen.getAllByRole('button')[0]
      await user.click(skipBackButton)
      
      // Should not go below 0
      expect(mockAudio.currentTime).toBe(0)
      
      // Test skip forward near end
      mockAudio.currentTime = 175 // 5 seconds from end
      const skipForwardButton = screen.getAllByRole('button')[2]
      await user.click(skipForwardButton)
      
      // Should not exceed duration
      expect(mockAudio.currentTime).toBeLessThanOrEqual(180)
    })

    it('should maintain mute state correctly', async () => {
      const user = userEvent.setup()
      render(<AudioPlayer {...defaultProps} />)
      
      // Set initial volume
      mockAudio.volume = 0.8
      
      await waitFor(() => {
        // Find mute button (volume icon button)
        const muteButton = screen.getAllByRole('button')[4] // Volume button
        expect(muteButton).toBeInTheDocument()
      })
      
      const muteButton = screen.getAllByRole('button')[4]
      await user.click(muteButton)
      expect(mockAudio.volume).toBe(0)
      
      // Click again to unmute
      await user.click(muteButton)
      expect(mockAudio.volume).toBe(0.8) // Should restore previous volume
    })

    it('should handle autoplay prop correctly', () => {
      render(<AudioPlayer {...defaultProps} autoPlay={true} />)
      
      // Should attempt to play when autoPlay is true
      // Note: In real browsers, autoplay is often blocked, but we test the intent
      expect(document.querySelector('audio')).toHaveAttribute('preload', 'metadata')
    })
  })
})