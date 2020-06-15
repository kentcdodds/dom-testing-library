import {userEvent} from '../../'
import {setup} from './helpers/utils'

test('unhover', async () => {
  const {element, getEventSnapshot} = setup('<button />')

  await userEvent.unhover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointermove
    button - mousemove: Left (0)
    button - pointerout
    button - pointerleave
    button - mouseout: Left (0)
    button - mouseleave: Left (0)
  `)
})

test('unhover on disabled element', async () => {
  const {element, getEventSnapshot} = setup('<button disabled />')

  await userEvent.unhover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointermove
    button - pointerout
    button - pointerleave
  `)
})

test('no events fired on labels that contain disabled controls', async () => {
  const {element, getEventSnapshot} = setup('<label><input disabled /></label>')

  await userEvent.unhover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: label`,
  )
})