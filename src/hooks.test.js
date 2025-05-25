// hooks.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import { useLocalStorage } from './hooks'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should use the initial value if localStorage is empty', () => {
    window.localStorage.getItem.mockReturnValueOnce(null)

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    )

    expect(result.current[0]).toBe('initial-value')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should use the value from localStorage if available', () => {
    window.localStorage.getItem.mockReturnValueOnce(
      JSON.stringify('stored-value')
    )

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    )

    expect(result.current[0]).toBe('stored-value')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should update localStorage when value changes', () => {
    window.localStorage.getItem.mockReturnValueOnce(
      JSON.stringify('stored-value')
    )

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    )

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    )
  })

  it('should handle function updates correctly', () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(10))

    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1]((prev) => prev + 5)
    })

    expect(result.current[0]).toBe(15)
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(15)
    )
  })

  it('should handle errors when reading from localStorage', () => {
    // Mock an error when reading
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback-value')
    )

    expect(result.current[0]).toBe('fallback-value')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should handle errors when writing to localStorage', () => {
    // Mock successful read
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify('initial'))

    // Mock an error when writing
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.setItem.mockImplementationOnce(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback-value')
    )

    act(() => {
      result.current[1]('new-value')
    })

    // The state should still update even if localStorage fails
    expect(result.current[0]).toBe('new-value')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
