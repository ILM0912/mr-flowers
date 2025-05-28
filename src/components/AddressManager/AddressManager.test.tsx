import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddressManager from "./AddressManager";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("AddressManager", () => {
  const addresses = ["Address 1", "Address 2"];
  const defaultAddressId = 1;

  it("отображает переданные адреса и выбранный дефолтный", () => {
    const store = mockStore({ auth: { email: "test@example.com" } });

    render(
      <Provider store={store}>
        <AddressManager addresses={addresses} defaultAddressId={defaultAddressId} />
      </Provider>
    );

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(addresses.length);
    expect(radios[defaultAddressId]).toBeChecked();
  });

  it("блокирует кнопку добавления при коротком адресе", () => {
    const store = mockStore({ auth: { email: "test@example.com" } });

    render(
      <Provider store={store}>
        <AddressManager addresses={[]} defaultAddressId={null} />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Новый адрес");
    const button = screen.getByRole("button", { name: "Добавить" });

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "1234" } });
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "12345" } });
    expect(button).toBeEnabled();
  });

  it("добавляет новый адрес при нажатии кнопки", () => {
    const store = mockStore({ auth: { email: "test@example.com" } });

    render(
      <Provider store={store}>
        <AddressManager addresses={[]} defaultAddressId={null} />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Новый адрес");
    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "12345 Some street" } });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(screen.getByText("12345 Some street")).toBeInTheDocument();
  });
});
