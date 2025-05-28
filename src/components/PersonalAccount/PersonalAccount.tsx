import React, { useState } from "react";
import { ReactComponent as EditIcon } from "../../images/edit.svg";
import { ReactComponent as BonusIcon } from "../../images/bonus.svg";
import style from "./PersonalAccount.module.css";
import { User } from "../../types";
import { useDispatch } from "react-redux";
import { logoutUser, refreshUser, updateName } from "../../store/AuthSlice";
import { AppDispatch } from "../../store";
import AddressManager from "../AddressManager";
import { formatPrice } from "../../utils";
import OrdersHistory from "../OrdersHistory";

interface PersonalAccountProps {
    user: User;
}

const PersonalAccount = ({ user }: PersonalAccountProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const dispatch = useDispatch<AppDispatch>();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        if (name.trim().length < 3 || name.trim().length > 50) {
            setName(user.name);
            setIsEditing(false);
            return;
        }

        dispatch(updateName({ email: user.email, name: name.trim() }));
        setIsEditing(false);
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleExit = () => {
        dispatch(logoutUser());
    };

    return (
        <div className={style.container}>
            <div className={style.top}>
                <div className={style["top__user-info"]}>
                    {isEditing ? (
                        <input
                            className={style["top__user-info__name"]}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            onBlur={handleSubmit}
                            onKeyDown={handleEnter}
                            maxLength={30}
                            minLength={3}
                            autoFocus
                        />
                    ) : (
                        <div className={style["top__user-info__name-block"]}>
                            <div className={style["top__user-info__name"]} onClick={handleEditClick}>{name}</div>
                            <EditIcon className={style["top__user-info__name-block__icon"]} onClick={handleEditClick} />
                        </div>
                    )}
                    <div className={style["top__user-info__email"]}>{user.email.toLowerCase()}</div>
                </div>
                
                <div className={style.top__bonuses}>
                    <BonusIcon className={style["top__bonuses__bonus-icon"]} />
                    <span>{user.bonuses<100000 ? formatPrice(user.bonuses).slice(0, -2) : "99 999+"}</span>
                </div>
            </div>
            <p className={style.logout} onClick={handleExit}>Выйти из аккаунта</p>
            
            <AddressManager addresses={user.address} defaultAddressId={user.defaultAddress} />
            <OrdersHistory orders={user.orders} />
        </div>
    );
};

export default PersonalAccount;
