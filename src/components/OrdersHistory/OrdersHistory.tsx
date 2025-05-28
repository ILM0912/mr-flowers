import style from "./OrdersHistory.module.css";
import { Order } from "../../types";
import { formatDate, formatDateTime, formatPrice } from "../../utils";
import { Link } from "react-router-dom";

interface OrdersHistoryProps {
    orders: Order[];
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => {
    return (
        <div className={style.container}>
            <h3 className={style.title}>История заказов</h3>
            {!orders.length ?
                <p className={style.empty}>У вас пока нет заказов.</p>
                : orders.map((order) => (
                <div key={order.id} className={style.item}>
                    <div className={style.item__data}>Создан: {formatDateTime(order.createdAt)}</div>
                    <div className={style.item__data}>Доставка: {formatDate(order.deliveryDate)}, {order.deliveryTime} - {(+order.deliveryTime.split(':')[0] + 1).toString().padStart(2, '0')}:00</div>
                    <div className={style.item__data}>Адрес: {order.deliveryAddress}</div>
                    <div className={style.item__data}>Сумма без скидки: {formatPrice(order.total)}</div>
                    <div className={style.item__data}>К оплате: {formatPrice(order.finalTotal)}</div>
                    <ul className={style.item__products}>
                        {order.items.map((item) => (
                            <li key={item.product.id} className={style.item__products__product}>
                                <Link
                                    className={style.item__products__product__link}
                                    to={`/product/${item.product.id}`}
                                >{
                                    item.product.name} — {item.quantity} шт.
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default OrdersHistory;
