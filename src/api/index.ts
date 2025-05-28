import { CartItemType, DetailedProduct, OrderCreateRequestType, ReviewRequestType } from "../types";

export const API_URL = "http://192.168.108.108:912";

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Ошибка при загрузке данных с сервера");
        }
        return await response.json();
    } catch (error) {
        throw new Error("Не удалось загрузить товары.");
    }
};

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
        throw new Error("Ошибка при получении категорий");
    }
    return response.json();
}

export const loginRequest = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Ошибка при входе в систему.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Не удалось войти в систему. Попробуйте снова.");
    }
};

export const registerRequest = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Ошибка при регистрации.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Не удалось зарегистрироваться. Попробуйте снова.");
    }
};

export const fetchUserCart = async (email: string) => {
	const response = await fetch(`${API_URL}/cart/update`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
	});
	if (!response.ok) throw new Error('Ошибка при получении корзины');
	return await response.json();
};

export const updateUserCart = async (email: string, cart: CartItemType[]) => {
	const response = await fetch(`${API_URL}/cart`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, cart }),
	});
	if (!response.ok) throw new Error('Ошибка при обновлении корзины');
};


export const fetchUserInfo = async (email: string) => {
    const res = await fetch(`${API_URL}/user?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Не удалось загрузить данные пользователя");
    return res.json();
}

export const updateUserAddresses = async (
    email: string,
    addresses: string[],
    defaultIndex: number | null
) => {
    const response = await fetch(`${API_URL}/update-addresses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            addresses,
            default: defaultIndex,
        }),
    });

    if (!response.ok) {
        throw new Error("Не удалось обновить адреса");
    }
};

export const updateUserName = async (email: string, name: string) => {
    const response = await fetch(`${API_URL}/user/name`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
        throw new Error("Не удалось обновить имя пользователя");
    }

    return await response.json();
};

export const getDetailedProduct = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/product/${id}`);
        if (!response.ok) return null;
        const data: DetailedProduct = await response.json();
        return data;
    } catch {
        return null;
    }
};


export const checkPromoCode = async (email: string, promoCode: string) => {
    try {
        const res = await fetch(`${API_URL}/promo/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                promo_code: promoCode,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Ошибка при проверке промокода');
        }

        return await res.json();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const createOrderRequest = async (
    order: OrderCreateRequestType
) => {
    try {
        const res = await fetch(`${API_URL}/order/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Ошибка при оформлении заказа');
        }

        return await res.json();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const sendReview = async (reviewData: ReviewRequestType) => {
    try {
        const res = await fetch(`${API_URL}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Ошибка при отправке отзыва');
        }

        return await res.json();
    } catch (error: any) {
        throw new Error(error.message);
    }
};