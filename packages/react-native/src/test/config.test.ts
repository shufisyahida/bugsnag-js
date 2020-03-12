import { load } from '../config'

describe('react-native config: load()', () => {
  it('should load config from the provided NativeClient', () => {
    const mockNativeClient = {
      configure: () => ({
        apiKey: '123'
      })
    }
    const config = load(mockNativeClient)
    expect(config.apiKey).toBe('123')
    expect(config._didLoadFromConfig).toBe(true)
    expect(config._originalValues).toEqual({ apiKey: '123' })
  })

  it('should throw if the provided NativeClient didn’t provide an object', () => {
    const mockNativeClient = {
      configure: () => {}
    }
    expect(() => {
      load(mockNativeClient)
    }).toThrow(/Configuration could not be loaded from native client/)
  })

  it('should warn if the user attempts to modify native config', () => {
    const warnSpy = jest.fn()
    const mockNativeClient = {
      configure: () => ({
        apiKey: '123',
        autoDetectErrors: true
      })
    }

    const config = load(mockNativeClient, '1.1.1', 'test', '2.2.2', warnSpy)

    config.apiKey = '456'
    config.autoDetectErrors = false

    expect(warnSpy.mock.calls.length).toBe(2)
    expect(warnSpy.mock.calls[0][0]).toMatch(/Cannot set "apiKey" configuration option in JS. This must be set in the native layer./)
    expect(warnSpy.mock.calls[1][0]).toMatch(/Cannot set "autoDetectErrors" configuration option in JS. This must be set in the native layer./)
  })
})
