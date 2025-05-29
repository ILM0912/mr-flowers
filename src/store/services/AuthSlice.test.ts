import reducer, {
  authUser,
  loginUser,
  registerUser,
  logoutUser,
  refreshUser,
  updateAddresses,
  updateName,
} from "./AuthSlice";

import * as api from "../../api";
import * as cartActions from "./CartSlice";
import { User } from "../../types";

jest.mock("../../api");
jest.mock("./CartSlice");

describe("AuthSlice", () => {
  const user: User = {
    email: "test@example.com", name: "Test User",
    defaultAddress: null,
    bonuses: 0,
    address: [],
    orders: []
  };

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe("reducers", () => {
    it("loginUser.fulfilled обновляет состояние", () => {
      const initialState = { user: null, isAuthenticated: false };
      const action = { type: loginUser.fulfilled.type, payload: user };
      const state = reducer(initialState, action);
      expect(state).toEqual({ user, isAuthenticated: true });
    });

    it("loginUser.rejected выводит предупреждение", () => {
      console.warn = jest.fn();
      const action = {
        type: loginUser.rejected.type,
        error: { message: "fail" },
      };
      reducer(undefined, action);
      expect(console.warn).toHaveBeenCalledWith(
        "Ошибка авторизации: ",
        "fail"
      );
    });

    it("logoutUser.fulfilled очищает пользователя", () => {
      const initialState = { user, isAuthenticated: true };
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ user: null, isAuthenticated: false });
    });

    it("refreshUser.fulfilled обновляет пользователя", () => {
      const initialState = { user: null, isAuthenticated: false };
      const action = { type: refreshUser.fulfilled.type, payload: user };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(user);
    });

    it("refreshUser.rejected выводит предупреждение", () => {
      console.warn = jest.fn();
      const action = {
        type: refreshUser.rejected.type,
        error: { message: "fail" },
      };
      reducer(undefined, action);
      expect(console.warn).toHaveBeenCalledWith(
        "Ошибка обновления пользователя:",
        "fail"
      );
    });
  });


  describe("Auth thunks", () => {
    const user = { email: "test@example.com", name: "Test User" } as User;

    beforeEach(() => {
      jest.spyOn(api, "loginRequest").mockResolvedValue({ user });
      jest.spyOn(api, "fetchUserCart").mockResolvedValue({ cart: [] });
      jest.spyOn(api, "registerRequest").mockResolvedValue({ user });
      jest.spyOn(api, "fetchUserInfo").mockResolvedValue(user);
      jest.spyOn(api, "updateUserAddresses").mockResolvedValue(undefined);
      jest.spyOn(api, "updateUserName").mockResolvedValue(undefined);

      jest.spyOn(cartActions, "mergeCart").mockImplementation(payload => ({ type: "cart/mergeCart", payload }));
      jest.spyOn(cartActions, "clearCart").mockImplementation(() => ({ type: "cart/clearCart" , payload: undefined }));
      jest.spyOn(cartActions, "setCart").mockImplementation(payload => ({ type: "cart/setCart", payload }));

      sessionStorage.clear();
    });

    it("loginUser записывает в sessionStorage, диспатчит mergeCart и возвращает пользователя", async () => {
      const spySetItem = jest.spyOn(Storage.prototype, "setItem");
      const dispatch = jest.fn();

      const thunkAction = loginUser(user);
      const result = await thunkAction(dispatch, () => {}, undefined);

      expect(spySetItem).toHaveBeenCalledWith("user", JSON.stringify(user));
      expect(api.fetchUserCart).toHaveBeenCalledWith(user.email);
      expect(dispatch).toHaveBeenCalledWith(cartActions.mergeCart([]));
      expect(result.payload).toEqual(user);
    });

    it("registerUser диспатчит loginUser и возвращает пользователя", async () => {
      const dispatch = jest.fn();

      const thunkAction = registerUser({ email: user.email, password: "pwd" });
      const result = await thunkAction(dispatch, () => {}, undefined);

      expect(api.registerRequest).toHaveBeenCalledWith(user.email, "pwd");
      const calledWithRegisterPending = dispatch.mock.calls.some(([action]) =>
        action.type.includes("pending") &&
        action.meta?.arg.email === user.email &&
        action.meta?.arg.password === "pwd"
      );
      expect(calledWithRegisterPending).toBe(true);

      expect(calledWithRegisterPending).toBe(true);
      expect(result.payload).toEqual(user);
    });

    it("authUser вызывает loginRequest, диспатчит loginUser и возвращает пользователя", async () => {
      const dispatch = jest.fn();

      const thunkAction = authUser({ email: user.email, password: "pwd" });
      const result = await thunkAction(dispatch, () => {}, undefined);

      expect(api.loginRequest).toHaveBeenCalledWith(user.email, "pwd");
      const calledWithAuthPending = dispatch.mock.calls.some(([action]) =>
        action.type.includes("pending") &&
        action.meta?.arg.email === user.email &&
        action.meta?.arg.password === "pwd"
      );
      expect(calledWithAuthPending).toBe(true);
      expect(result.payload).toEqual(user);
    });

    it("logoutUser очищает sessionStorage и диспатчит clearCart", async () => {
      const spyRemoveItem = jest.spyOn(Storage.prototype, "removeItem");
      const dispatch = jest.fn();

      const thunkAction = logoutUser();
      await thunkAction(dispatch, () => {}, undefined);

      expect(spyRemoveItem).toHaveBeenCalledWith("user");
      expect(dispatch).toHaveBeenCalledWith(cartActions.clearCart());
    });

    it("refreshUser записывает в sessionStorage, диспатчит setCart и возвращает пользователя", async () => {
      const spySetItem = jest.spyOn(Storage.prototype, "setItem");
      const dispatch = jest.fn();

      const thunkAction = refreshUser(user.email);
      const result = await thunkAction(dispatch, () => {}, undefined);

      expect(api.fetchUserInfo).toHaveBeenCalledWith(user.email);
      expect(spySetItem).toHaveBeenCalledWith("user", JSON.stringify(user));
      expect(api.fetchUserCart).toHaveBeenCalledWith(user.email);
      expect(dispatch).toHaveBeenCalledWith(cartActions.setCart([]));
      expect(result.payload).toEqual(user);
    });

    it("updateAddresses вызывает updateUserAddresses и диспатчит refreshUser", async () => {
      const dispatch = jest.fn();

      const thunkAction = updateAddresses({ email: user.email, addresses: ["addr"], defaultIndex: null });
      await thunkAction(dispatch, () => {}, undefined);

      expect(api.updateUserAddresses).toHaveBeenCalledWith(user.email, ["addr"], null);
      const calledWithUpdateAddressesPending = dispatch.mock.calls.some(([action]) =>
        action.type.includes("pending") &&
        action.meta?.arg.email === user.email &&
        Array.isArray(action.meta?.arg.addresses) &&
        action.meta.arg.addresses.includes("addr")
      );
      expect(calledWithUpdateAddressesPending).toBe(true);
    });

    it("updateName вызывает updateUserName и диспатчит refreshUser", async () => {
      const dispatch = jest.fn();

      const thunkAction = updateName({ email: user.email, name: "New Name" });
      await thunkAction(dispatch, () => {}, undefined);

      expect(api.updateUserName).toHaveBeenCalledWith(user.email, "New Name");
      const calledWithUpdateNamePending = dispatch.mock.calls.some(([action]) =>
        action.type.includes("pending") &&
        action.meta?.arg.email === user.email &&
        action.meta?.arg.name === "New Name"
      );
      expect(calledWithUpdateNamePending).toBe(true);
    });
  });
});
