import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../../store/services/CartSlice";
import style from "./QuantityCounter.module.css";

interface QuantityCounterProps {
    id: string;
    quantity: number;
}

const QuantityCounter = ({ id, quantity }: QuantityCounterProps) => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(quantity.toString());

    useEffect(() => {
        setInputValue(quantity.toString());
    }, [quantity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setInputValue(value);
        }
    };

    const applyChange = () => {
        const num = parseInt(inputValue, 10);
        if (isNaN(num)) setInputValue(quantity.toString());
        else if (num < 0) {
            dispatch(updateQuantity({ id, quantity: 1 }))
            setInputValue("1");
        }
        else if (num > 101) {
            dispatch(updateQuantity({ id, quantity: 101 }))
            setInputValue("101");
        }
        else dispatch(updateQuantity({ id, quantity: num }));
    };

    const increment = () => {
        if (quantity < 101) {
            dispatch(updateQuantity({ id, quantity: quantity + 1 }));
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            dispatch(updateQuantity({ id, quantity: quantity - 1 }));
        } else {
            dispatch(updateQuantity({ id, quantity: 0 }));
        }
    };

    return (
        <div className={style.container}>
            <button className={style.button} data-cy={'quantity-decrease'} onClick={decrement}>−</button>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={applyChange}
                data-cy={'quantity'} 
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        applyChange();
                        e.currentTarget.blur();
                    }
                }}
                className={style.input}
                inputMode="numeric"
                pattern="[0-9]*"
            />
            <button className={style.button} data-cy={'quantity-increase'} onClick={increment}>+</button>
        </div>
    );
};

export default QuantityCounter;
