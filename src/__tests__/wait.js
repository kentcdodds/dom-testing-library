import {wait} from '../'

test('it waits for the data to be loaded', async () => {
  const spy = jest.fn()
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 60)
  setTimeout(spy, randomTimeout)

  await wait(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith()
})

test('wait defaults to a noop callback', async () => {
  await expect(wait()).rejects.toMatchInlineSnapshot(
    `[Error: wait callback is required]`,
  )
})

test('can timeout after the given timeout time', async () => {
  const error = new Error('throws every time')
  const result = await wait(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result).toBe(error)
})

test('can timeout after the given timeout time', async () => {
  const error = new Error('throws every time')
  const result = await wait(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result).toBe(error)
})
