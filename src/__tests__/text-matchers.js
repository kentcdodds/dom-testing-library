import 'jest-dom/extend-expect'
import cases from 'jest-in-case'
import {render} from './helpers/test-utils'

cases(
  'matches find case-sensitive full strings by default',
  ({dom, query, queryFn}) => {
    const queries = render(dom)
    expect(queries[queryFn](query)).toHaveLength(1)
    expect(queries[queryFn](query.toUpperCase())).toHaveLength(0) // case
    expect(queries[queryFn](query.slice(1))).toHaveLength(0) // substring
  },
  {
    queryAllByTestId: {
      dom: `<a data-testid="link" href="#">Link</a>`,
      query: `link`,
      queryFn: `queryAllByTestId`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
    queryAllByPlaceholderText: {
      dom: `<input placeholder="Dwayne 'The Rock' Johnson" />`,
      query: `Dwayne 'The Rock' Johnson`,
      queryFn: `queryAllByPlaceholderText`,
    },
    queryAllByText: {
      dom: `
        <p>
          Content
          with
          linebreaks
          is
          ok
        </p>`,
      query: `Content with linebreaks is ok`,
      queryFn: `queryAllByText`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">User Name</label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
  },
)

cases(
  'attribute queries trim leading & trailing whitespace by default',
  ({dom, query, queryFn}) => {
    const queries = render(dom)
    expect(queries[queryFn](query)).toHaveLength(1)
    expect(queries[queryFn](query, {trim: false})).toHaveLength(0)
  },
  {
    queryAllByTestId: {
      dom: `<a data-testid=" link " href="#">Link</a>`,
      query: /^link$/,
      queryFn: `queryAllByTestId`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="
            Finding Nemo poster " 
          src="/finding-nemo.png"
        />`,
      query: /^Finding Nemo poster$/,
      queryFn: `queryAllByAltText`,
    },
    queryAllByPlaceholderText: {
      dom: `
        <input placeholder="  Dwayne 'The Rock' Johnson  " />`,
      query: /^Dwayne/,
      queryFn: `queryAllByPlaceholderText`,
    },
  },
)

cases(
  'content queries trim leading, trailing & inner whitespace by default',
  ({dom, query, queryFn}) => {
    const queries = render(dom)
    expect(queries[queryFn](query)).toHaveLength(1)
    expect(
      queries[queryFn](query, {collapseWhitespace: false, trim: false}),
    ).toHaveLength(0)
  },
  {
    queryAllByText: {
      dom: `
        <p>
          Content
          with
          linebreaks
          is
          ok
        </p>`,
      query: `Content with linebreaks is ok`,
      queryFn: `queryAllByText`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">
          User
          Name
        </label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
  },
)

cases(
  '{ exact } option toggles case-insensitive partial matches',
  ({dom, query, queryFn}) => {
    const queries = render(dom)
    expect(queries[queryFn](query)).toHaveLength(1)
    expect(queries[queryFn](query.split(' ')[0], {exact: false})).toHaveLength(
      1,
    )
    expect(queries[queryFn](query.toLowerCase(), {exact: false})).toHaveLength(
      1,
    )
  },
  {
    queryAllByPlaceholderText: {
      dom: `<input placeholder="Dwayne 'The Rock' Johnson" />`,
      query: `Dwayne 'The Rock' Johnson`,
      queryFn: `queryAllByPlaceholderText`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">User Name</label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
    queryAllByText: {
      dom: `
        <p>
          Content
          with
          linebreaks
          is
          ok
        </p>`,
      query: `Content with linebreaks is ok`,
      queryFn: `queryAllByText`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
  },
)
