import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CatalogController from "./CatalogController";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";

import * as api from "../../api";

const mockStore = configureStore([]);
const store = mockStore({cart: {items: []}});

jest.mock('../../images/empty.svg', () => ({
  ReactComponent: () => <div />,
}));
jest.mock('../../images/error.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/loading.svg', () => ({
  ReactComponent: () => <svg />,
}));


jest.mock("../../api");

describe("CatalogController", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (api.getProducts as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "Rose",
        price: 100,
        category: "flowers",
        rating: 5,
        reviews_length: 10,
        image: "rose.jpg",
      },
    ]);
    (api.getCategories as jest.Mock).mockResolvedValue(["flowers", "bouquets"]);
  });

  it("рендерится и отображает заголовок, инпут и каталоги", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CatalogController />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Каталог магазина MR Flowers")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Поиск товара по названию")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Rose")).toBeInTheDocument();
      expect(screen.getByText("bouquets")).toBeInTheDocument();
      expect(screen.getByText("flowers")).toBeInTheDocument();
    });
  });

  it("отображает сообщение об ошибке при ошибке загрузки", async () => {
    (api.getProducts as jest.Mock).mockRejectedValue(new Error("Ошибка сервера"));
    (api.getCategories as jest.Mock).mockResolvedValue(["flowers"]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CatalogController />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Ошибка сервера")).toBeInTheDocument();
    });
  });
});
