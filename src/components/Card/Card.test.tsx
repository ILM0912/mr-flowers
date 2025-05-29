import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../store/services/CartSlice";
import { BrowserRouter } from "react-router-dom";
import { SortOrderTypes } from "src/types";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg />,
}));

const product = {
  id: '1',
  name: "Test Flower",
  price: 1000,
  image: "flower.jpg",
  rating: 0.0,
  category: 'цветок',
  reviews_length: 0
};

const catalogState = {
  query: "",
  filter: "",
  sort: "rating" as SortOrderTypes,
};

describe("Card", () => {
  it("рендерит карточку с названием и ценой", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Card product={product} catalogState={catalogState} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(/1 000 \₽/)).toBeInTheDocument();
  });

  it("обрабатывает клик по ссылке", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Card product={product} catalogState={catalogState} />
        </BrowserRouter>
      </Provider>
    );

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(link).toBeInTheDocument();
  });
});
