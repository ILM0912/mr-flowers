import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartContent from "./CartContent";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureStore([]);
jest.mock('../../../src/images/empty.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/loading.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/success.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/error.svg', () => ({
  ReactComponent: () => <svg />,
}));

const product1 = { id: "1", name: "Test Flower 1", price: 1000 };
const product2 = { id: "2", name: "Test Flower 2", price: 2000 };

const itemsInCart = [
  { product: product1, quantity: 2 },
  { product: product2, quantity: 1 },
];

describe("CartContent", () => {
  it("показывает пустую корзину, если items пустой", () => {
    const store = mockStore({ cart: { items: [], loaded: true }});

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartContent />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Ваша корзина пуста/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Выбрать все/i })).toBeNull();
  });

  it("отображает товары, кнопку выбора и оформление", () => {
    const store = mockStore({ cart: { items: itemsInCart, loaded: true }});

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartContent />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Test Flower 1")).toBeInTheDocument();
    expect(screen.getByText("Test Flower 2")).toBeInTheDocument();

    const checkoutBtn = screen.getByRole("button", { name: /Перейти к оформлению/i });
    expect(checkoutBtn).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Снять выделение/i }));
    expect(checkoutBtn).toBeDisabled();
  });
});
