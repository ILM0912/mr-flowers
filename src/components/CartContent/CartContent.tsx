import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CartState, removeFromCart } from '../../store/CartSlice';
import CartItem from '../CartItem';
import OrderForm from '../OrderForm';
import style from './CartContent.module.css';
import { formatPrice } from '../../utils';
import { ReactComponent as EmptyIcon } from '../../../src/images/empty.svg';
import { setOrderItems } from '../../store/OrderSlice';

const CartContent = () => {
    const { items, loaded } : CartState = useSelector((state: any) => state.cart);
    const dispatch = useDispatch();

    const [selectedIds, setSelectedIds] = useState<string[]>(items.map(item => item.product.id));
    const [isOrdering, setIsOrdering] = useState(false);

    
    useEffect(() => {
        if (loaded) {
            setSelectedIds(items.map(item => item.product.id));
        }
    }, [loaded, items]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmitOrder = () => {
        selectedItems.forEach(item => {
            handleRemove(item.product.id)
        });
    };

    const selectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item.product.id));
        }
        dispatch(setOrderItems(items.filter(item => selectedIds.includes(item.product.id))));
    };

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const selectedItems = items.filter(item => selectedIds.includes(item.product.id));
    dispatch(setOrderItems(items.filter(item => selectedIds.includes(item.product.id))));
    if (isOrdering) {
        return <OrderForm onSubmit={handleSubmitOrder} onExit={() => setIsOrdering(false)}/>;
    }

    if (!loaded) return null;

    return (
        <div className={style.container}>
            {items.length === 0 ? "" :
                <button onClick={selectAll} className={style['select-all']}>
                    {selectedIds.length === items.length ? 'Снять выделение' : 'Выбрать все'}
                </button>
            }
            
            <ul className={style.list}>
                {items.length === 0 || !items ? (
                    <div className={style.list__empty}>
                        <EmptyIcon className={style.list__empty__icon} />
                        <div>Ваша корзина пуста</div>
                    </div>
                ) : (
                    items.map(item => (
                        <CartItem
                            key={item.product.id}
                            item={item}
                            checked={selectedIds.includes(item.product.id)}
                            onCheck={() => toggleSelect(item.product.id)}
                            onRemove={() => handleRemove(item.product.id)}
                        />
                    ))
                )}
            </ul>
            {
                items.length === 0 ? "" :
                    <button
                        onClick={() => setIsOrdering(true)}
                        disabled={selectedIds.length === 0}
                        className={style.checkout}
                    >
                        <span>Перейти к оформлению</span>
                        {selectedIds.length !== 0 &&
                            <span>
                                К оплате: {formatPrice(selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0))}
                            </span>
                        }
                    </button>
            }

        </div>
    );
};

export default CartContent;
