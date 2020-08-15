import {getUserTrace} from '../get-user-trace'

jest.mock('fs', () => ({
  readFileSync: () => `
    import { screen } from '@testing-library/dom'

    it('renders', () => {
      document.body.appendChild(
        document.createTextNode('Hello world')
      )
      screen.debug()
      
      
      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })
  `,
}))

let globalErrorMock

beforeEach(() => {
  // Mock global.Error so we can setup our own stack messages
  globalErrorMock = jest.spyOn(global, 'Error')
})

afterEach(() => {
  global.Error.mockRestore()
})

test('it returns only client error when frames from node_modules are first', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/home/john/projects/projects/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      at somethingWrong (/home/john/projects/sample-error/error-example.js:8:7)
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserTrace(stack)
  expect(userTrace).toMatchInlineSnapshot(`
    "  6 |         document.createTextNode('Hello world')
      7 |       )
    > 8 |       screen.debug()
        |       ^
    "
  `)
})

test('it returns only client error when node frames are present afterwards', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/home/john/projects/projects/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      at somethingWrong (/home/john/projects/sample-error/error-example.js:8:7)
      at Object.<anonymous> (/home/user/Documents/projects/sample-error/error-example.js:14:1)
      at Module._compile (internal/modules/cjs/loader.js:1151:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1171:10)
      at Module.load (internal/modules/cjs/loader.js:1000:32)
      at Function.Module._load (internal/modules/cjs/loader.js:899:14)
      at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
      at internal/main/run_main_module.js:17:47
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserTrace()
  expect(userTrace).toMatchInlineSnapshot(`
    "  6 |         document.createTextNode('Hello world')
      7 |       )
    > 8 |       screen.debug()
        |       ^
    "
  `)
})
