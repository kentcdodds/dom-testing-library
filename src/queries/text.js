import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {DEFAULT_IGNORE_TAGS} from '../config'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
} from './all-utils'

function queryAllByText(
  container,
  text,
  {
    selector = '*',
    exact = true,
    collapseWhitespace,
    trim,
    ignore = DEFAULT_IGNORE_TAGS,
    normalizer,
  } = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  let baseArray = []
  if (typeof container.matches === 'function' && container.matches(selector)) {
    baseArray = [container]
  }
  return [...baseArray, ...Array.from(container.querySelectorAll(selector))]
    .filter(node => !ignore || !node.matches(ignore))
    .filter(node => matcher(getNodeText(node), node, text, matchNormalizer))
}

const getMultipleError = (c, text) =>
  `Found multiple elements with the text: ${text}`
const getMissingError = (c, text) => {
  const errorMsgBase = `Unable to find an element using the provided matcher.`
  let errorMsgExtnd = ''
  if (typeof text !== 'function') {
    errorMsgExtnd = `The matcher is - ${text} This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`
  }
  return errorMsgBase.concat(errorMsgExtnd)
}

const queryAllByTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByText,
  queryAllByText.name,
  'queryAll',
)

const [
  queryByText,
  getAllByText,
  getByText,
  findAllByText,
  findByText,
] = buildQueries(queryAllByText, getMultipleError, getMissingError)

export {
  queryByText,
  queryAllByTextWithSuggestions as queryAllByText,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
}
