import {elementRoles} from 'aria-query'
import {computeAccessibleName} from 'dom-accessibility-api'
import {prettyDOM} from './pretty-dom'

const elementRoleList = buildElementRoleList(elementRoles)

/**
 * @param {Element} element -
 * @returns {boolean} - `true` if `element` and its subtree are inaccessible
 */
function isSubtreeInaccessible(element: HTMLElement): boolean {
  if (element.hidden === true) {
    return true
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true
  }

  const window = element.ownerDocument.defaultView
  if (window.getComputedStyle(element).display === 'none') {
    return true
  }

  return false
}

interface IsInaccessibleOptions {
  isSubtreeInaccessible?: typeof isSubtreeInaccessible
}
/**
 * Partial implementation https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
 * which should only be used for elements with a non-presentational role i.e.
 * `role="none"` and `role="presentation"` will not be excluded.
 *
 * Implements aria-hidden semantics (i.e. parent overrides child)
 * Ignores "Child Presentational: True" characteristics
 *
 * @param {Element} element -
 * @param {object} [options] -
 * @param {function (element: Element): boolean} options.isSubtreeInaccessible -
 * can be used to return cached results from previous isSubtreeInaccessible calls
 * @returns {boolean} true if excluded, otherwise false
 */
function isInaccessible(
  element: HTMLElement,
  options: IsInaccessibleOptions = {},
): boolean {
  const {
    isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible,
  } = options
  const window = element.ownerDocument.defaultView
  // since visibility is inherited we can exit early
  if (window.getComputedStyle(element).visibility === 'hidden') {
    return true
  }

  let currentElement = element
  while (currentElement) {
    if (isSubtreeInaccessibleImpl(currentElement)) {
      return true
    }

    currentElement = currentElement.parentElement
  }

  return false
}

function getImplicitAriaRoles(currentNode) {
  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
  for (const {selector, roles} of elementRoleList) {
    if (currentNode.matches(selector)) {
      return [...roles]
    }
  }

  return []
}

function buildElementRoleList(elementRolesMap) {
  function makeElementSelector({name, attributes = []}) {
    return `${name}${attributes
      .map(({name: attributeName, value, constraints = []}) => {
        const shouldNotExist = constraints.indexOf('undefined') !== -1
        if (shouldNotExist) {
          return `:not([${attributeName}])`
        } else if (value) {
          return `[${attributeName}="${value}"]`
        } else {
          return `[${attributeName}]`
        }
      })
      .join('')}`
  }

  function getSelectorSpecificity({attributes = []}) {
    return attributes.length
  }

  function bySelectorSpecificity(
    {specificity: leftSpecificity},
    {specificity: rightSpecificity},
  ) {
    return rightSpecificity - leftSpecificity
  }

  let result = []

  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
  for (const [element, roles] of elementRolesMap.entries()) {
    result = [
      ...result,
      {
        selector: makeElementSelector(element),
        roles: Array.from(roles),
        specificity: getSelectorSpecificity(element),
      },
    ]
  }

  return result.sort(bySelectorSpecificity)
}

function getRoles(container, {hidden = false} = {}): Record<string, Element[]> {
  function flattenDOM(node: ParentNode) {
    return [
      node,
      ...Array.from(node.children).reduce(
        (acc, child) => [...acc, ...flattenDOM(child)],
        [],
      ),
    ]
  }

  return flattenDOM(container)
    .filter(element => {
      return hidden === false ? isInaccessible(element) === false : true
    })
    .reduce((acc, node: Element) => {
      let roles: Array<string> = []
      // TODO: This violates html-aria which does not allow any role on every element
      if (node.hasAttribute('role')) {
        roles = node.getAttribute('role').split(' ').slice(0, 1)
      } else {
        roles = getImplicitAriaRoles(node)
      }

      return roles.reduce(
        (rolesAcc, role) =>
          Array.isArray(rolesAcc[role])
            ? {...rolesAcc, [role]: [...rolesAcc[role], node]}
            : {...rolesAcc, [role]: [node]},
        acc,
      )
    }, {})
}

function prettyRoles(dom: HTMLElement, {hidden}) {
  const roles = getRoles(dom, {hidden})

  return Object.entries(roles)
    .map(([role, elements]) => {
      const delimiterBar = '-'.repeat(50)
      const elementsString = elements
        .map(el => {
          const nameString = `Name "${computeAccessibleName(el)}":\n`
          const domString = prettyDOM(el.cloneNode(false) as Element)
          return `${nameString}${domString}`
        })
        .join('\n\n')

      return `${role}:\n\n${elementsString}\n\n${delimiterBar}`
    })
    .join('\n')
}

const logRoles = (dom: HTMLElement, {hidden = false} = {}) =>
  console.log(prettyRoles(dom, {hidden}))

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)selected, undefined if not selectable
 */
function computeAriaSelected(element) {
  // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // https://www.w3.org/TR/html-aam-1.0/#details-id-97
  if (element.tagName === 'OPTION') {
    return element.selected
  }
  // explicit value
  const attributeValue = element.getAttribute('aria-selected')
  if (attributeValue === 'true') {
    return true
  }
  if (attributeValue === 'false') {
    return false
  }
  return undefined
}

export {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  isSubtreeInaccessible,
  prettyRoles,
  isInaccessible,
  computeAriaSelected,
}