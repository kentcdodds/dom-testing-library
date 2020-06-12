import * as userEvent from '..'
import {setup, addListeners} from './helpers/utils'
import './helpers/custom-element'

test('types text in input', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.type(element, 'Sup')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Sup"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: S (83)
    input[value=""] - keypress: S (83)
    input[value=""] - input
      "{CURSOR}" -> "S{CURSOR}"
    input[value="S"] - select
    input[value="S"] - keyup: S (83)
    input[value="S"] - keydown: u (117)
    input[value="S"] - keypress: u (117)
    input[value="S"] - input
      "S{CURSOR}" -> "Su{CURSOR}"
    input[value="Su"] - select
    input[value="Su"] - keyup: u (117)
    input[value="Su"] - keydown: p (112)
    input[value="Su"] - keypress: p (112)
    input[value="Su"] - input
      "Su{CURSOR}" -> "Sup{CURSOR}"
    input[value="Sup"] - select
    input[value="Sup"] - keyup: p (112)
  `)
})

test('types text in input with allAtOnce', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.type(element, 'Sup', {allAtOnce: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Sup"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - input
      "{CURSOR}" -> "Sup{CURSOR}"
    input[value="Sup"] - select
  `)
})

test('types text inside custom element', async () => {
  const element = document.createElement('custom-el')
  document.body.append(element)
  const inputEl = element.shadowRoot.querySelector('input')
  const {getEventSnapshot} = addListeners(inputEl)

  await userEvent.type(inputEl, 'Sup')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Sup"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: S (83)
    input[value=""] - keypress: S (83)
    input[value=""] - input
      "{CURSOR}" -> "S{CURSOR}"
    input[value="S"] - select
    input[value="S"] - keyup: S (83)
    input[value="S"] - keydown: u (117)
    input[value="S"] - keypress: u (117)
    input[value="S"] - input
      "S{CURSOR}" -> "Su{CURSOR}"
    input[value="Su"] - select
    input[value="Su"] - keyup: u (117)
    input[value="Su"] - keydown: p (112)
    input[value="Su"] - keypress: p (112)
    input[value="Su"] - input
      "Su{CURSOR}" -> "Sup{CURSOR}"
    input[value="Sup"] - select
    input[value="Sup"] - keyup: p (112)
  `)
})

test('types text in textarea', async () => {
  const {element, getEventSnapshot} = setup('<textarea></textarea>')
  await userEvent.type(element, 'Sup')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="Sup"]

    textarea[value=""] - focus
    textarea[value=""] - select
    textarea[value=""] - keydown: S (83)
    textarea[value=""] - keypress: S (83)
    textarea[value=""] - input
      "{CURSOR}" -> "S{CURSOR}"
    textarea[value="S"] - select
    textarea[value="S"] - keyup: S (83)
    textarea[value="S"] - keydown: u (117)
    textarea[value="S"] - keypress: u (117)
    textarea[value="S"] - input
      "S{CURSOR}" -> "Su{CURSOR}"
    textarea[value="Su"] - select
    textarea[value="Su"] - keyup: u (117)
    textarea[value="Su"] - keydown: p (112)
    textarea[value="Su"] - keypress: p (112)
    textarea[value="Su"] - input
      "Su{CURSOR}" -> "Sup{CURSOR}"
    textarea[value="Sup"] - select
    textarea[value="Sup"] - keyup: p (112)
  `)
})

test('should append text all at once', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.type(element, 'Sup', {allAtOnce: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Sup"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - input
      "{CURSOR}" -> "Sup{CURSOR}"
    input[value="Sup"] - select
  `)
})

test('does not fire input event when keypress calls prevent default', async () => {
  const {element, getEventSnapshot} = setup('<input />', {
    eventHandlers: {keyPress: e => e.preventDefault()},
  })

  await userEvent.type(element, 'a')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: a (97)
    input[value=""] - keypress: a (97)
    input[value=""] - keyup: a (97)
  `)
})

test('does not fire keypress or input events when keydown calls prevent default', async () => {
  const {element, getEventSnapshot} = setup('<input />', {
    eventHandlers: {keyDown: e => e.preventDefault()},
  })

  await userEvent.type(element, 'a')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: a (97)
    input[value=""] - keyup: a (97)
  `)
})

test('does not fire events when disabled', async () => {
  const {element, getEventSnapshot} = setup('<input disabled />')

  await userEvent.type(element, 'a')
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: input[value=""]`,
  )
})

test('does not fire input when readonly', async () => {
  const {element, getEventSnapshot} = setup('<input readonly />')

  await userEvent.type(element, 'a')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: a (97)
    input[value=""] - keypress: a (97)
    input[value=""] - keyup: a (97)
  `)
})

test('does not fire input when readonly (with allAtOnce)', async () => {
  const {element, getEventSnapshot} = setup('<input readonly />')

  await userEvent.type(element, 'a', {allAtOnce: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
  `)
})

test('does not fire any events when disabled (with allAtOnce)', async () => {
  const {element, getEventSnapshot} = setup('<input disabled />')

  await userEvent.type(element, 'a', {allAtOnce: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: input[value=""]`,
  )
})

test('should delay the typing when opts.delay is not 0', async () => {
  const inputValues = [{timestamp: Date.now(), value: ''}]
  const onInput = jest.fn(event => {
    inputValues.push({timestamp: Date.now(), value: event.target.value})
  })

  const {element} = setup('<input />', {eventHandlers: {input: onInput}})

  const text = 'Hello, world!'
  const delay = 10
  await userEvent.type(element, text, {delay})

  expect(onInput).toHaveBeenCalledTimes(text.length)
  for (let index = 1; index < inputValues.length; index++) {
    const {timestamp, value} = inputValues[index]
    expect(timestamp - inputValues[index - 1].timestamp).toBeGreaterThanOrEqual(
      delay,
    )
    expect(value).toBe(text.slice(0, index))
  }
})

test('honors maxlength', async () => {
  const {element, getEventSnapshot} = setup('<input maxlength="2" />')
  await userEvent.type(element, '123')

  // NOTE: no input event when typing "3"
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="12"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: 1 (49)
    input[value=""] - keypress: 1 (49)
    input[value=""] - input
      "{CURSOR}" -> "1{CURSOR}"
    input[value="1"] - select
    input[value="1"] - keyup: 1 (49)
    input[value="1"] - keydown: 2 (50)
    input[value="1"] - keypress: 2 (50)
    input[value="1"] - input
      "1{CURSOR}" -> "12{CURSOR}"
    input[value="12"] - select
    input[value="12"] - keyup: 2 (50)
    input[value="12"] - keydown: 3 (51)
    input[value="12"] - keypress: 3 (51)
    input[value="12"] - keyup: 3 (51)
  `)
})

test('honors maxlength with existing text', async () => {
  const {element, getEventSnapshot} = setup(
    '<input value="12" maxlength="2" />',
  )
  await userEvent.type(element, '3')

  // NOTE: no input event when typing "3"
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="12"]

    input[value="12"] - focus
    input[value="12"] - select
    input[value="12"] - keydown: 3 (51)
    input[value="12"] - keypress: 3 (51)
    input[value="12"] - keyup: 3 (51)
  `)
})

test('should fire events on the currently focused element', async () => {
  const {element} = setup(`<div><input /><input /></div>`, {
    eventHandlers: {keyDown: handleKeyDown},
  })

  const input1 = element.children[0]
  const input2 = element.children[1]

  const text = 'Hello, world!'
  const changeFocusLimit = 7
  function handleKeyDown() {
    if (input1.value.length === 7) {
      input2.focus()
    }
  }

  await userEvent.type(input1, text)

  expect(input1).toHaveValue(text.slice(0, changeFocusLimit))
  expect(input2).toHaveValue(text.slice(changeFocusLimit))
  expect(input2).toHaveFocus()
})

test('should replace selected text', async () => {
  const {element} = setup('<input value="hello world" />')
  const selectionStart = 'hello world'.search('world')
  const selectionEnd = selectionStart + 'world'.length
  element.setSelectionRange(selectionStart, selectionEnd)
  await userEvent.type(element, 'friend')
  expect(element).toHaveValue('hello friend')
})

test('does not continue firing events when disabled during typing', async () => {
  const {element} = setup('<input />', {
    eventHandlers: {input: e => (e.target.disabled = true)},
  })
  await userEvent.type(element, 'hi')
  expect(element).toHaveValue('h')
})

function setupDollarInput({initialValue = ''} = {}) {
  const returnValue = setup(`<input value="${initialValue}" type="text" />`, {
    eventHandlers: {input: handleInput},
  })
  let previousValue = returnValue.element.value
  function handleInput(event) {
    const val = event.target.value
    const withoutDollar = val.replace(/\$/g, '')
    const num = Number(withoutDollar)
    if (Number.isNaN(num)) {
      event.target.value = previousValue
    } else {
      event.target.value = `$${withoutDollar}`
    }
    previousValue = event.target.value
  }
  return returnValue
}

test('typing into a controlled input works', async () => {
  const {element, getEventSnapshot} = setupDollarInput()

  await userEvent.type(element, '23')

  expect(element.value).toBe('$23')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="$23"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: 2 (50)
    input[value=""] - keypress: 2 (50)
    input[value=""] - input
      "{CURSOR}" -> "$2{CURSOR}"
    input[value="$2"] - keyup: 2 (50)
    input[value="$2"] - keydown: 3 (51)
    input[value="$2"] - keypress: 3 (51)
    input[value="$2"] - input
      "$2{CURSOR}" -> "$23{CURSOR}"
    input[value="$23"] - select
    input[value="$23"] - keyup: 3 (51)
  `)
})

test('typing in the middle of a controlled input works', async () => {
  const {element, getEventSnapshot} = setupDollarInput({initialValue: '$23'})
  element.setSelectionRange(2, 2)

  await userEvent.type(element, '1')

  expect(element.value).toBe('$213')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="$213"]

    input[value="$23"] - select
    input[value="$23"] - focus
    input[value="$23"] - keydown: 1 (49)
    input[value="$23"] - keypress: 1 (49)
    input[value="$23"] - input
      "$2{CURSOR}3" -> "$213{CURSOR}"
    input[value="$213"] - select
    input[value="$213"] - keyup: 1 (49)
  `)
})

test('ignored {backspace} in controlled input', async () => {
  const {element, getEventSnapshot} = setupDollarInput({initialValue: '$23'})
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')
  // this is the same behavior in the browser.
  // in our case, when you try to backspace the "$", our event handler
  // will ignore that change and React resets the value to what it was
  // before. When the value is set programmatically to something different
  // from what was expected based on the input event, the browser sets
  // the selection start and end to the end of the input
  expect(element.selectionStart).toBe(element.value.length)
  expect(element.selectionEnd).toBe(element.value.length)
  await userEvent.type(element, '4')

  expect(element.value).toBe('$234')
  // the backslash in the inline snapshot is to escape the $ before {CURSOR}
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="$234"]

    input[value="$23"] - select
    input[value="$23"] - focus
    input[value="$23"] - keydown: Backspace (8)
    input[value="$23"] - input
      "\${CURSOR}23" -> "$23{CURSOR}"
    input[value="$23"] - keyup: Backspace (8)
    input[value="$23"] - keydown: 4 (52)
    input[value="$23"] - keypress: 4 (52)
    input[value="$23"] - input
      "$23{CURSOR}" -> "$234{CURSOR}"
    input[value="$234"] - select
    input[value="$234"] - keyup: 4 (52)
  `)
})

// https://github.com/testing-library/user-event/issues/321
test('typing in a textarea with existing text', async () => {
  const {element, getEventSnapshot} = setup('<textarea>Hello, </textarea>')

  await userEvent.type(element, '12')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="Hello, 12"]

    textarea[value="Hello, "] - focus
    textarea[value="Hello, "] - select
    textarea[value="Hello, "] - keydown: 1 (49)
    textarea[value="Hello, "] - keypress: 1 (49)
    textarea[value="Hello, "] - input
      "Hello, {CURSOR}" -> "Hello, 1{CURSOR}"
    textarea[value="Hello, 1"] - select
    textarea[value="Hello, 1"] - keyup: 1 (49)
    textarea[value="Hello, 1"] - keydown: 2 (50)
    textarea[value="Hello, 1"] - keypress: 2 (50)
    textarea[value="Hello, 1"] - input
      "Hello, 1{CURSOR}" -> "Hello, 12{CURSOR}"
    textarea[value="Hello, 12"] - select
    textarea[value="Hello, 12"] - keyup: 2 (50)
  `)
  expect(element).toHaveValue('Hello, 12')
})

// https://github.com/testing-library/user-event/issues/321
test('accepts an initialSelectionStart and initialSelectionEnd', async () => {
  const {element, getEventSnapshot} = setup('<textarea>Hello, </textarea>')
  element.setSelectionRange(0, 0)

  await userEvent.type(element, '12', {
    initialSelectionStart: element.selectionStart,
    initialSelectionEnd: element.selectionEnd,
  })
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="12Hello, "]

    textarea[value="Hello, "] - select
    textarea[value="Hello, "] - focus
    textarea[value="Hello, "] - select
    textarea[value="Hello, "] - keydown: 1 (49)
    textarea[value="Hello, "] - keypress: 1 (49)
    textarea[value="Hello, "] - input
      "{CURSOR}Hello, " -> "1Hello, {CURSOR}"
    textarea[value="1Hello, "] - select
    textarea[value="1Hello, "] - keyup: 1 (49)
    textarea[value="1Hello, "] - keydown: 2 (50)
    textarea[value="1Hello, "] - keypress: 2 (50)
    textarea[value="1Hello, "] - input
      "1{CURSOR}Hello, " -> "12Hello, {CURSOR}"
    textarea[value="12Hello, "] - select
    textarea[value="12Hello, "] - keyup: 2 (50)
  `)
  expect(element).toHaveValue('12Hello, ')
})

// https://github.com/testing-library/user-event/issues/316#issuecomment-640199908
test('can type into an input with type `email`', async () => {
  const {element} = setup('<input type="email" />')
  const email = 'yo@example.com'
  await userEvent.type(element, email)
  expect(element).toHaveValue(email)
})

// https://github.com/testing-library/user-event/issues/336
test('can type "-" into number inputs', async () => {
  const {element, getEventSnapshot} = setup('<input type="number" />')
  const negativeNumber = '-3'
  await userEvent.type(element, negativeNumber)
  expect(element).toHaveValue(-3)

  // NOTE: the input event here does not actually change the value thanks to
  // weirdness with browsers. Then the second input event inserts both the
  // - and the 3. /me rolls eyes
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="-3"]

    input[value=""] - focus
    input[value=""] - keydown: - (45)
    input[value=""] - keypress: - (45)
    input[value=""] - input
    input[value=""] - keyup: - (45)
    input[value=""] - keydown: 3 (51)
    input[value=""] - keypress: 3 (51)
    input[value=""] - input
      "{CURSOR}" -> "{CURSOR}-3"
    input[value="-3"] - keyup: 3 (51)
  `)
})

// https://github.com/testing-library/user-event/issues/336
test('can type "." into number inputs', async () => {
  const {element, getEventSnapshot} = setup('<input type="number" />')
  await userEvent.type(element, '0.3')
  expect(element).toHaveValue(0.3)

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=".3"]

    input[value=""] - focus
    input[value=""] - keydown: 0 (48)
    input[value=""] - keypress: 0 (48)
    input[value=""] - input
      "{CURSOR}" -> "{CURSOR}0"
    input[value="0"] - keyup: 0 (48)
    input[value="0"] - keydown: . (46)
    input[value="0"] - keypress: . (46)
    input[value="0"] - input
      "{CURSOR}0" -> "{CURSOR}"
    input[value=""] - keyup: . (46)
    input[value=""] - keydown: 3 (51)
    input[value=""] - keypress: 3 (51)
    input[value=""] - input
      "{CURSOR}" -> "{CURSOR}.3"
    input[value=".3"] - keyup: 3 (51)
  `)
})

test('-{backspace}3', async () => {
  const {element} = setup('<input type="number" />')
  const negativeNumber = '-{backspace}3'
  await userEvent.type(element, negativeNumber)
  expect(element).toHaveValue(3)
})

test('-a3', async () => {
  const {element} = setup('<input type="number" />')
  const negativeNumber = '-a3'
  await userEvent.type(element, negativeNumber)
  expect(element).toHaveValue(-3)
})

test('typing an invalid input value', async () => {
  const {element} = setup('<input type="number" />')
  await userEvent.type(element, '3-3')

  // TODO: fix this bug
  // THIS IS A BUG! It should be expect(element.value).toBe('')
  expect(element).toHaveValue(-3)

  // THIS IS A LIMITATION OF THE BROWSER
  // It is impossible to programmatically set an input
  // value to an invlid value. Not sure how to work around this
  // but the badInput should actually be "true" if the user types "3-3"
  expect(element.validity.badInput).toBe(false)
})
