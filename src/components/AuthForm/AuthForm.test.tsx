// AuthForm.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";

jest.mock("react-redux", () => ({
  useDispatch: () => () => {},
}));

describe("AuthForm", () => {
  it("переключается между авторизацией и регистрацией", () => {
    render(<AuthForm />);

    expect(screen.getByText("Авторизация")).toBeInTheDocument();

    const switchLink = screen.getByText("Нет аккаунта? Зарегистрироваться");
    fireEvent.click(switchLink);

    expect(screen.getByText("Регистрация")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Уже есть аккаунт? Войти"));
    expect(screen.getByText("Авторизация")).toBeInTheDocument();
  });

  it("показывает ошибку при несовпадении паролей при регистрации", () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Нет аккаунта? Зарегистрироваться"));

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Подтвердите пароль"), { target: { value: "password321" } });

    fireEvent.click(screen.getByText("Зарегистрироваться"));

    expect(screen.getByText("Пароли не совпадают!")).toBeInTheDocument();
  });
});
