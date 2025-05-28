export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviews_length: number;
}

export interface Review {
    id: string;
    author: string;
    email: string;
    text: string;
    date: string;
    stars: number;
}

export interface DetailedProduct extends Product {
    description: string;
    reviews: Review[] | null;
}

export interface Order {
    id: number;
    items: CartItemType[];
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTime: string;
    phone: string;
    bonusesToUse: number;
    total: number;
    finalTotal: number;
    email: string;
    createdAt: string;
}


export interface User {
    defaultAddress: number | null;
    email: string;
    name: string;
    bonuses: number;
    address: string[],
    orders: Order[]
}

export type SortOrderTypes = "asc" | "desc" | "alphabet" | "rating";

// cart-store
export interface CartItemType {
    product: Product;
    quantity: number;
}

export interface OrderCreateRequestType {
    items: CartItemType[];
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTime: string;
    phone: string;
    bonusesToUse: number;
    total: number;
    finalTotal: number;
    email?: string;
}

export interface ReviewRequestType {
    productId: string;
    text: string;
    stars: number;
    email: string;
}