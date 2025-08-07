import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock WaveSurfer before importing the component
const mockWaveSurfer = {
  create: vi.fn(() => ({
    load: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    playPause: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn(),
    setVolume: vi.fn(),
    getDuration: vi.fn(() => 180),
    getCurrentTime: vi.fn(() => 0),
    seekTo: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    isPlaying: vi.fn(() => false),
  })),
}

vi.mock('wavesurfer.js', () => ({
  default: mockWaveSurfer,
}))

// Import the component after mocking
import AudioPlayer from '@/components/audio-player'

describe('WaveSurfer Audio Player', () => {
  const defaultProps = {
    src: 'https://example.com/arabic-audio.mp3',
    title: 'مقال صوتي عربي',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize WaveSurfer correctly', async () => {
    render(<AudioPlayer {...defaultProps} />)
    
    await waitFor(() => {
      expect(mockWaveSurfer.create).toHaveBeenCalled()
    })
  })

  it('should handle play/pause with WaveSurfer', async () => {
    const mockInstance = mockWaveSurfer.create()
    render(<AudioPlayer {...defaultProps} />)
    
    const playButton = screen.getByRole('button')
    await userEvent.click(playButton)
    
    expect(mockInstance.playPause).toHaveBeenCalled()
  })

  it('should handle volume changes with WaveSurfer', async () => {
    const mockInstance = mockWaveSurfer.create()
    render(<AudioPlayer {...defaultProps} />)
    
    const volumeSlider = screen.getByRole('slider')
    fireEvent.input(volumeSlider, { target: { value: 75 } })
    
    expect(mockInstance.setVolume).toHaveBeenCalledWith(0.75)
  })
})