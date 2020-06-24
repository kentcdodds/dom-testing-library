import {
  getByLabelText,
  getAllByLabelText,
  queryAllByLabelText,
  queryByLabelText,
  findByLabelText,
  findAllByLabelText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  queryAllByPlaceholderText,
  queryByPlaceholderText,
  findByPlaceholderText,
  findAllByPlaceholderText,
  getByText,
  getAllByText,
  queryAllByText,
  queryByText,
  findByText,
  findAllByText,
  getByAltText,
  getAllByAltText,
  queryAllByAltText,
  queryByAltText,
  findByAltText,
  findAllByAltText,
  getByTitle,
  getAllByTitle,
  queryAllByTitle,
  queryByTitle,
  findByTitle,
  findAllByTitle,
  getByDisplayValue,
  getAllByDisplayValue,
  queryAllByDisplayValue,
  queryByDisplayValue,
  findByDisplayValue,
  findAllByDisplayValue,
  getByRole,
  getAllByRole,
  queryAllByRole,
  queryByRole,
  findByRole,
  findAllByRole,
  getByTestId,
  getAllByTestId,
  queryAllByTestId,
  queryByTestId,
  findByTestId,
  findAllByTestId,
} from '..'

describe('synchronous queries throw on invalid container type', () => {
  test.each([
    ['getByLabelText', getByLabelText],
    ['getAllByLabelText', getAllByLabelText],
    ['queryByLabelText', queryByLabelText],
    ['queryAllByLabelText', queryAllByLabelText],
    ['getByPlaceholderText', getByPlaceholderText],
    ['getAllByPlaceholderText', getAllByPlaceholderText],
    ['queryByPlaceholderText', queryByPlaceholderText],
    ['queryAllByPlaceholderText', queryAllByPlaceholderText],
    ['getByText', getByText],
    ['getAllByText', getAllByText],
    ['queryByText', queryByText],
    ['queryAllByText', queryAllByText],
    ['getByAltText', getByAltText],
    ['getAllByAltText', getAllByAltText],
    ['queryByAltText', queryByAltText],
    ['queryAllByAltText', queryAllByAltText],
    ['getByTitle', getByTitle],
    ['getAllByTitle', getAllByTitle],
    ['queryByTitle', queryByTitle],
    ['queryAllByTitle', queryAllByTitle],
    ['getByDisplayValue', getByDisplayValue],
    ['getAllByDisplayValue', getAllByDisplayValue],
    ['queryByDisplayValue', queryByDisplayValue],
    ['queryAllByDisplayValue', queryAllByDisplayValue],
    ['getByRole', getByRole],
    ['getAllByRole', getAllByRole],
    ['queryByRole', queryByRole],
    ['queryAllByRole', queryAllByRole],
    ['getByTestId', getByTestId],
    ['getAllByTestId', getAllByTestId],
    ['queryByTestId', queryByTestId],
    ['queryAllByTestId', queryAllByTestId],
  ])('%s', (_queryName, query) => {
    expect(() =>
      query('invalid type for container', 'irrelevant text'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got string."`,
    )
  })
})

describe('asynchronous queries throw on invalid container type', () => {
  test.each([
    ['findByLabelText', findByLabelText],
    ['findAllByLabelText', findAllByLabelText],
    ['findByPlaceholderText', findByPlaceholderText],
    ['findAllByPlaceholderText', findAllByPlaceholderText],
    ['findByText', findByText],
    ['findAllByText', findAllByText],
    ['findByAltText', findByAltText],
    ['findAllByAltText', findAllByAltText],
    ['findByTitle', findByTitle],
    ['findAllByTitle', findAllByTitle],
    ['findByDisplayValue', findByDisplayValue],
    ['findAllByDisplayValue', findAllByDisplayValue],
    ['findByRole', findByRole],
    ['findAllByRole', findAllByRole],
    ['findByTestId', findByTestId],
    ['findAllByTestId', findAllByTestId],
  ])('%s', (_queryName, query) => {
    const queryOptions = {}
    const waitOptions = {timeout: 1, onTimeout: e => e}
    return expect(
      query(
        'invalid type for container',
        'irrelevant text',
        queryOptions,
        waitOptions,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got string."`,
    )
  })
})
