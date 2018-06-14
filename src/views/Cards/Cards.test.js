import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './Cards';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Cards />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Cards component', () => {
  test('render', () => {
    const { wrapper } = setup()
    expect(wrapper).toMatchSnapshot()
  })
});
