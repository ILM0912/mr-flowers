import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addToCart } from "../../store/services/CartSlice";
import QuantityCounter from "../QuantityCounter/QuantityCounter";
import style from "./CartButton.module.css";
import { Product } from "../../types";

interface CartButtonProps {
    product: Product;
}

const CartButton = ({ product } : CartButtonProps) => {
    const dispatch = useDispatch();
    const item = useSelector((state: RootState) =>
        state.cart.items.find(i => i.product.id === product.id)
    );

    const quantity = item?.quantity || 0;

    const handleAdd = () => {
        dispatch(addToCart({ product, quantity: 1 }));
    };

    return (
        <div className={style.container} data-cy={'cart-button'}>
            {quantity === 0 ? (
                <button className={style["add-button"]} onClick={handleAdd}>В корзину</button>
            ) : (
                <QuantityCounter
                    quantity={quantity}
                    id={product.id}
                />
            )}
        </div>
    );
};

export default CartButton;
