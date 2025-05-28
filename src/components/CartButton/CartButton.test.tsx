import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartButton from "./CartButton";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const product = {
  id: "1",
  name: "Test Flower",
  price: 1000,
  image: "flower.jpg",
  rating: 0.0,
  category: "цветок",
  reviews_length: 0,
};

describe("CartButton", () => {
  it("показывает кнопку 'В корзину', если товара нет в корзине", () => {
    const store = mockStore({ cart: { items: [] } });

    render(
      <Provider store={store}>
        <CartButton product={product} />
      </Provider>
    );

    expect(screen.getByText("В корзину")).toBeInTheDocument();
  });

  it("показывает QuantityCounter если товар есть в корзине", () => {
    const store = mockStore({ cart: { items: [{ product, quantity: 3 }] } });

    render(
      <Provider store={store}>
        <CartButton product={product} />
      </Provider>
    );

    expect(screen.queryByText("В корзину")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });
});
