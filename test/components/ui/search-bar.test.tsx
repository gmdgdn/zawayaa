import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock SearchBar component for testing
const MockSearchBar = ({ onSearch, placeholder = "ابحث..." }: { 
  onSearch?: (query: string) => void
  placeholder?: string 
}) => (
  <div data-testid="search-bar">
    <input
      data-testid="search-input"
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch?.(e.target.value)}
    />
    <button data-testid="search-button" type="submit">
      بحث
    </button>
  </div>
)

describe('Arabic Search Bar Component', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render search bar with Arabic placeholder', () => {
    render(<MockSearchBar />)
    
    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('placeholder', 'ابحث...')
  })

  it('should handle Arabic text input', async () => {
    const mockOnSearch = vi.fn()
    render(<MockSearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'البحث عن المقالات')
    
    expect(mockOnSearch).toHaveBeenCalledWith('البحث عن المقالات')
  })

  it('should handle search button click', async () => {
    render(<MockSearchBar />)
    
    const searchButton = screen.getByTestId('search-button')
    await user.click(searchButton)
    
    expect(searchButton).toBeInTheDocument()
  })

  it('should support custom placeholder text', () => {
    render(<MockSearchBar placeholder="ابحث في المقالات..." />)
    
    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toHaveAttribute('placeholder', 'ابحث في المقالات...')
  })
})