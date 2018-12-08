function fuzzyMatches(
  textToMatch,
  node,
  matcher,
  {collapseWhitespace = true, trim = true, normalizer} = {},
) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = normalize(textToMatch, {
    trim,
    collapseWhitespace,
    normalizer,
  })
  if (typeof matcher === 'string') {
    return normalizedText.toLowerCase().includes(matcher.toLowerCase())
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

function matches(
  textToMatch,
  node,
  matcher,
  {collapseWhitespace = true, trim = true, normalizer} = {},
) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = normalize(textToMatch, {
    trim,
    collapseWhitespace,
    normalizer,
  })
  if (typeof matcher === 'string') {
    return normalizedText === matcher
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

function normalize(text, {trim, collapseWhitespace, normalizer}) {
  let normalizedText = text
  normalizedText = trim ? normalizedText.trim() : normalizedText
  normalizedText = collapseWhitespace
    ? normalizedText.replace(/\s+/g, ' ')
    : normalizedText
  normalizedText = normalizer ? normalizer(normalizedText) : normalizedText
  return normalizedText
}

export {fuzzyMatches, matches}
