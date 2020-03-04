import {wait} from './wait'

const isRemoved = result => !result || (Array.isArray(result) && !result.length)

// Check if the element is not present.
// As the name implies, waitForElementToBeRemoved should check `present` --> `removed`
function initialCheck(elements) {
  if (isRemoved(elements)) {
    throw new Error(
      'The callback function which was passed did not return an element or non-empty array of elements. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
    )
  }
}

async function waitForElementToBeRemoved(callback, options) {
  if (typeof callback !== 'function') {
    // await waitForElementToBeRemoved(getAllByText('Hello'))
    initialCheck(callback)
    const elements = Array.isArray(callback) ? callback : [callback]
    const getRemainingElements = elements.map(element => {
      let parent = element.parentElement
      while (parent.parentElement) parent = parent.parentElement
      return () => (parent.contains(element) ? element : null)
    })
    callback = () => getRemainingElements.map(c => c()).filter(Boolean)
  }

  initialCheck(callback())

  return wait(() => {
    let result
    try {
      result = callback()
    } catch (error) {
      if (error.name === 'TestingLibraryElementError') {
        return true
      }
      throw error
    }
    if (!isRemoved(result)) {
      throw new Error('Timed out in waitForElementToBeRemoved.')
    }
    return true
  }, options)
}

export {waitForElementToBeRemoved}

/*
eslint
  require-await: "off"
*/
