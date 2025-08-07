import { describe, it, expect, vi } from 'vitest'

describe('Cross-Environment Compatibility', () => {
  it('should have required global objects available', () => {
    // Test that essential globals are available in both happy-dom and jsdom
    expect(global.window).toBeDefined()
    expect(global.document).toBeDefined()
    expect(global.HTMLElement).toBeDefined()
    expect(global.HTMLAudioElement).toBeDefined()
  })

  it('should have polyfills for missing APIs', () => {
    // Test polyfills that ensure compatibility between environments
    expect(global.structuredClone).toBeDefined()
    expect(global.URL.createObjectURL).toBeDefined()
    expect(global.URL.revokeObjectURL).toBeDefined()
    expect(global.Blob).toBeDefined()
    expect(global.File).toBeDefined()
    expect(global.performance.now).toBeDefined()
  })

  it('should handle HTMLMediaElement properties correctly', () => {
    const audio = new HTMLAudioElement()
    
    // Test that all required properties are available
    expect(audio.duration).toBeDefined()
    expect(audio.currentTime).toBeDefined()
    expect(audio.paused).toBeDefined()
    expect(audio.volume).toBeDefined()
    expect(audio.playbackRate).toBeDefined()
    
    // Test that methods are available
    expect(audio.play).toBeDefined()
    expect(audio.pause).toBeDefined()
    expect(audio.load).toBeDefined()
  })

  it('should handle DOM events consistently', () => {
    const element = document.createElement('div')
    const handler = vi.fn()
    
    // Test event handling works in both environments
    element.addEventListener('click', handler)
    element.click()
    
    expect(handler).toHaveBeenCalled()
  })

  it('should handle async operations correctly', async () => {
    // Test that Promise-based operations work consistently
    const result = await Promise.resolve('test')
    expect(result).toBe('test')
    
    // Test setTimeout/setInterval work
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => resolve('timeout'), 0)
    })
    
    const timeoutResult = await timeoutPromise
    expect(timeoutResult).toBe('timeout')
  })
})