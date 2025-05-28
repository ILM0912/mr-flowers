import React, { useEffect, useState } from "react";
import style from "./AddressManager.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { refreshUser } from "../../store/AuthSlice";
import { updateUserAddresses } from "../../api";

interface AddressManagerProps {
    addresses: string[];
    defaultAddressId: number | null;
}

const AddressManager = ({ addresses, defaultAddressId }: AddressManagerProps) => {
    const [currentAddresses, setCurrentAddresses] = useState<string[]>(addresses);
    const [currentDefault, setCurrentDefault] = useState<number | null>(defaultAddressId);
    const [newAddress, setNewAddress] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const email = useSelector((state : RootState) => state.auth.user?.email);

    useEffect(() => {
        setCurrentAddresses(addresses);
    }, [addresses]);

    useEffect(() => {
        setCurrentDefault(defaultAddressId);
    }, [defaultAddressId]);

    const handleAdd = () => {
        if (newAddress.trim()) {
            setCurrentAddresses([...currentAddresses, newAddress.trim()]);
            setNewAddress("");
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    const handleRemove = (index: number) => {
        const updated = currentAddresses.filter((_, i) => i !== index);
        setCurrentAddresses(updated);
        if (index === currentDefault) {
            setCurrentDefault(null);
        } else if (currentDefault !== null && index < currentDefault) {
            setCurrentDefault(currentDefault - 1);
        }
    };

    const handleSave = () => {
        if (email) {
            updateUserAddresses(email, currentAddresses, currentDefault)
                .then(() => {
                    dispatch(refreshUser(email));
                })
        }
        
    };

    const handleCancel = () => {
        setCurrentAddresses(addresses);
        setCurrentDefault(defaultAddressId);
        setNewAddress("");
    };

    const isSameAddresses =
        addresses.length === currentAddresses.length &&
        addresses.every((addr, idx) => addr === currentAddresses[idx]);

    const isSameDefault =
        (currentDefault === null && defaultAddressId === null) ||
        (currentDefault !== null &&
        defaultAddressId !== null &&
        addresses[defaultAddressId] === currentAddresses[currentDefault]);

    return (
        <div className={style.container}>
            <h3 className={style.title}>Адреса доставки</h3>

            <ul className={style.list}>
                {currentAddresses.length !== 0 ? currentAddresses.map((address, index) => (
                    <li key={index} className={style.list__item}>
                        <label className={style.list__item__radio}>
                            <input
                                type="radio"
                                checked={index === currentDefault}
                                onChange={() => setCurrentDefault(index)}
                            />
                            <span>{address}</span>
                        </label>
                        <svg
                            className={style.list__item__remove}
                            onClick={() => handleRemove(index)}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </li>
                )): <p className={style.list__item}>Тут пока пусто...</p>}
            </ul>

            <div className={style["input-wrapper"]}>
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Новый адрес"
                    className={style["input-wrapper__input"]}
                    maxLength={300}
                    minLength={5}
                />
                <button
                    onClick={handleAdd}
                    disabled={newAddress.trim().length < 5}
                    className={style["input-wrapper__button"]}
                >
                    Добавить
                </button>
            </div>

            <div className={style.actions}>
                <button
                    onClick={handleSave}
                    className={style.actions__save}
                    disabled={isSameAddresses && isSameDefault}
                >
                    Сохранить
                </button>
                <p
                    onClick={handleCancel}
                    className={style.actions__cancel}
                >
                    Отмена
                </p>
            </div>
        </div>
    );
};

export default AddressManager;
