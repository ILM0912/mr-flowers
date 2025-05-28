import { render, screen } from '@testing-library/react';
import Catalog from './Catalog';
import { BrowserRouter } from 'react-router-dom'; // если внутри Card используется Link
import { Product, SortOrderTypes } from '../../types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg />,
}));

const products: Product[] = [
  {
    id: '1',
    name: 'Flower 1',
    price: 1000,
    image: 'flower1.jpg',
    rating: 0.0,
    reviews_length: 0,
    category: 'цветы'
  },
  {
    id: '2',
    name: 'Flower 2',
    price: 800,
    image: 'flower2.jpg',
    rating: 0.0,
    reviews_length: 0,
    category: 'цветы'
  },
];

const catalogState = {
  query: '',
  sort: 'rating' as SortOrderTypes,
  filter: ''
};

describe("Catalog", () => {
  const store = mockStore({cart: {items: []}});

  it("отображает карточки товаров по переданному массиву products", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Catalog products={products} catalogState={catalogState} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText("Flower 1")).toBeInTheDocument();
    expect(screen.getByText("Flower 2")).toBeInTheDocument();
  });
});
