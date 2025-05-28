import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Header from "../Header";

jest.mock('../../images/logo.svg', () => ({
  ReactComponent: () => <div data-testid="logo">Логотип</div>,
}));
jest.mock('../../images/cart.svg', () => ({
  ReactComponent: () => <div data-testid="cart">Корзина</div>,
}));
jest.mock('../../images/profile.svg', () => ({
  ReactComponent: () => <div data-testid="profile">Профиль</div>,
}));


const mockStore = configureStore([]);

describe("Header", () => {
  it("рендерится без ошибок и отображает количество товаров в корзине", () => {
    const store = mockStore({
      cart: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("cart")).toBeInTheDocument();
    expect(screen.getByTestId("profile")).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("отображает '9+' если товаров в корзине 10 и больше", () => {
    const items = Array(12).fill({ id: 1 });
    const store = mockStore({
      cart: {
        items,
      },
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("не показывает счетчик, если корзина пуста", () => {
    const store = mockStore({
      cart: {
        items: [],
      },
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.queryByText(/^\d+$/)).toBeNull();
    expect(screen.queryByText("9+")).toBeNull();
  });
});
