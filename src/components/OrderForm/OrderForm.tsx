import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { refreshUser } from '../../store/AuthSlice';
import { CartItemType, OrderCreateRequestType } from 'src/types';
import { formatPrice } from '../../utils';
import { IMaskInput } from 'react-imask';
import style from './OrderForm.module.css';
import { checkPromo, createOrder } from '../../api';
import OrderModal from '../OrderModal/OrderModal';

interface OrderFormProps {
    items: CartItemType[];
    onExit: () => void;
    onSubmit: () => void;
}

const OrderForm = ({ items, onExit, onSubmit }: OrderFormProps) => {
    const orderItems = useRef(items);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
    const [customAddress, setCustomAddress] = useState('');
    const [useBonuses, setUseBonuses] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [phone, setPhone] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoMessage, setPromoMessage] = useState('');

    const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        setIsModalOpen(true);
        setOrderStatus('loading');
        const order: OrderCreateRequestType = {
            items: orderItems.current,
            deliveryAddress: deliveryAddress,
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            phone: phone,
            bonusesToUse: bonusesToUse,
            total: total,
            finalTotal: adjustedTotal,
            email: user?.email
        }

        createOrder(order)
            .then((data) => {
                setOrderStatus('success');
                onSubmit();
                console.log(data);
            })
            .catch((e) => {
                setOrderStatus('error');
                console.log(e.message);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onExit();
    };

    useEffect(() => {
        if (user?.email) {
            dispatch(refreshUser(user.email));
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDeliveryDate(tomorrow.toISOString().split('T')[0]);
        if ((user?.defaultAddress || user?.defaultAddress === 0) && user?.address[user?.defaultAddress]) {
            setSelectedAddressIndex(user.defaultAddress);
        }
    }, []);

    const [total, setTotal] = useState(0);
    const [bonusesToUse, setBonusesToUse] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [adjustedTotal, setAdjustedTotal] = useState(0);
    const [bonusesToAccrue, setBonusesToAccrue] = useState(0);

    useEffect(() => {
        const totalSum = orderItems.current.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const validDiscount = Math.min(Math.max(discount, 0), 100);

        let validBonuses = useBonuses && user
            ? Math.min(Math.max(user.bonuses, 0), totalSum)
            : 0;

        const afterBonuses = totalSum - validBonuses;
        const discountVal = Math.floor(afterBonuses * validDiscount / 100);
        let newAdjustedTotal = afterBonuses - discountVal;

        if (newAdjustedTotal < 1) {
            newAdjustedTotal = 1;
            validBonuses = validBonuses - 1;
        }
        const bonusesAccrual = Math.floor(newAdjustedTotal * 0.1);
        setTotal(totalSum);
        setBonusesToUse(validBonuses);
        setDiscountAmount(discountVal);
        setAdjustedTotal(newAdjustedTotal);
        setBonusesToAccrue(bonusesAccrual);
    }, [orderItems, useBonuses, user, discount]);

    const deliveryAddress = user && selectedAddressIndex !== null && selectedAddressIndex >= 0
        ? user.address[selectedAddressIndex]
        : customAddress ? customAddress.trim() : '';

    const isAddressValid = deliveryAddress.trim().length >= 5;

    const handlePromoCodeCheck = () => {
        if (!user) return;
        checkPromo(user.email, promoCode)
            .then(result => {
                if (result.valid) {
                    setPromoError('');
                    setDiscount(result.discount);
                    setPromoMessage(result.message);
                } else {
                    setPromoError('Промокод недействителен');
                    setDiscount(0);
                    setPromoMessage("");
                }
            })
            .catch(err => {
                setPromoError(err.message);
            });
    };


    const timeOptions = Array.from({ length: 12 }, (_, i) => {
        const hour = 9 + i;
        return `${hour.toString().padStart(2, '0')}:00`;
    });


    const isPhoneValid = /^7\d{10}$/.test(phone);
    const isOrderDisabled = !isAddressValid || !deliveryTime || !isPhoneValid;

    return (
        <div className={style.container}>
            <h2 className={style.title}>Оформление заказа</h2>

            <div className={style.section}>
                <h3 className={style.section__title}>Товары:</h3>
                <ul className={style.section__list}>
                    {orderItems.current.map(item => (
                        <li key={item.product.id} className={style.section__list__item}>
                            <span className={style.section__list__item__name}>{item.product.name}</span>
                            <span className={style.section__list__item__info}>
                                {formatPrice(item.product.price)} × {item.quantity} шт. = {formatPrice(item.product.price * item.quantity)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={style.section}>
                <h3 className={style.section__title}>Номер телефона получателя:</h3>
                <IMaskInput
                    className={style.section__input}
                    mask={'+{7} (000) 000 00 00'}
                    placeholder="Введите номер телефон получателя"
                    value={phone}
                    type='tel'
                    unmask={true}
                    onAccept={(value: string) => setPhone(value)}
                />
            </div>

            <div className={style.section}>
                <h3 className={style.section__title}>Адрес доставки:</h3>
                {user && user.address.length > 0 && (
                    <div className={style.section__addresses}>
                        {user.address.map((addr, idx) => (
                            <label key={idx} className={style.section__addresses__address}>
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddressIndex === idx}
                                    onChange={() => setSelectedAddressIndex(idx)}
                                />
                                <span>{addr}</span>
                            </label>
                        ))}
                        <label className={style.section__addresses__address}>
                            <input
                                type="radio"
                                name="address"
                                checked={selectedAddressIndex === null}
                                onChange={() => setSelectedAddressIndex(null)}
                            />
                            <span>Другой адрес</span>
                        </label>
                    </div>
                )}
                <input
                    className={style.section__input}
                    type="text"
                    placeholder="Введите адрес доставки"
                    value={customAddress}
                    maxLength={300}
                    minLength={5}
                    onClick={() => setSelectedAddressIndex(null)}
                    onChange={e => setCustomAddress(e.target.value)}
                />
            </div>

            <div className={style.section}>
                <h3 className={style.section__title}>Дата и время доставки:</h3>
                <div className={style.section__datetime}>
                    <input
                        className={style.section__input}
                        type="date"
                        value={deliveryDate}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        onChange={e => setDeliveryDate(e.target.value)}
                    />
                    <select
                        className={style.section__input}
                        value={deliveryTime}
                        onChange={e => setDeliveryTime(e.target.value)}
                    >
                        <option value="" disabled>Выберите время</option>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}–{(+time.split(':')[0] + 1).toString().padStart(2, '0')}:00</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={style.section}>
                <h3 className={style.section__title}>Бонусы и промокод:</h3>
                {user ? (
                    <>
                        <label className={style.section__bonuses}>
                            <input
                                type="checkbox"
                                checked={useBonuses}
                                onChange={e => setUseBonuses(e.target.checked)}
                            />
                            Списать бонусы: {formatPrice(user.bonuses).slice(0, -2)}
                        </label>

                        <div className={style.section__promo}>
                            <input
                                className={style.section__promo__input}
                                type="text"
                                value={promoCode.toUpperCase()}
                                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="Введите промокод"
                            />
                            <button
                                className={style.section__promo__check}
                                onClick={handlePromoCodeCheck}
                            >
                                Применить
                            </button>
                        </div>

                        {promoError && (
                            <p className={style.section__error}>
                                {promoError}
                            </p>
                        )}

                        {!promoError && promoMessage && (
                            <p className={style.section__message_promo}>
                                {promoMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <div className={style.section__message}>
                        Войдите в аккаунт, чтобы использовать бонусы и промокод
                    </div>
                )}
            </div>

            <div className={style.section}>
                <h3 className={style.section__title}>Итого</h3>
                <div className={style.section__summary}>
                    {user && (
                        <>
                            <div className={style.section__summary__row}>
                                <span>Сумма заказа:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className={style.section__summary__row}>
                                <span>Списано бонусов:</span>
                                <span>{bonusesToUse ? "-" + formatPrice(bonusesToUse).slice(0, -2) : "нет"}</span>
                            </div>
                            <div className={style.section__summary__row}>
                                <span>Скидка по промокоду:</span>
                                <span>{discountAmount ? "-" + formatPrice(discountAmount) : "нет"}</span>
                            </div>
                            <div className={style.section__summary__row}>
                                <span>Начислим бонусов:</span>
                                <span>{bonusesToAccrue ? "+" + formatPrice(bonusesToAccrue).slice(0, -2) : "нет"}</span>
                            </div>
                        </>
                    )}
                    <div className={`${style.section__summary__row} ${style.section__summary__row_total}`}>
                        <span>К оплате:</span>
                        <span>{formatPrice(adjustedTotal)}</span>
                    </div>
                </div>

                <div className={style.actions}>
                    <button
                        className={style.actions__submit}
                        disabled={isOrderDisabled}
                        onClick={handleSubmit}
                    >
                        Заказать за {formatPrice(adjustedTotal)}
                    </button>
                    <p className={style.actions__cancel} onClick={onExit}>
                        Назад
                    </p>
                </div>
            </div>

            {isModalOpen && orderStatus && (
                <OrderModal status={orderStatus} onExit={handleCloseModal} />
            )}
        </div>
    );
};

export default OrderForm;
