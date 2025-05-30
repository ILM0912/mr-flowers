import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authUser, registerUser } from "../../store/services/AuthSlice";
import style from "./AuthForm.module.css"
import { AppDispatch } from "../../store/store";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegistering) {
                if (password !== confirmPassword) {
                    setError("Пароли не совпадают!");
                    return;
                }
                await dispatch(registerUser({ email, password })).unwrap();
            } else {
                await dispatch(authUser({ email, password })).unwrap();
            }
        } catch (err: any) {
            setError(err.message || "Ошибка авторизации/регистрации");
        }
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>
                {isRegistering ? "Регистрация" : "Авторизация"}
            </h1>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style["form__input-group"]}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        data-cy={'email'}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={style["form__input-group__input"]}
                    />
                </div>
                <div className={style["form__input-group"]}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        data-cy={'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className={style["form__input-group__input"]}
                    />
                </div>
                {isRegistering && (
                <div className={style["form__input-group"]}>
                    <label htmlFor="confirmPassword">Подтвердите пароль</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        data-cy={'repeat-password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className={style["form__input-group__input"]}
                    />
                </div>
                )}
                <button type="submit" data-cy={'submit'} className={style["form__submit"]}>
                    {isRegistering ? "Зарегистрироваться" : "Войти"}
                </button>
            </form>
            {error && <div className={style.error}>{error}</div>}
            <p
                className={style.switch}
                data-cy={'tab'}
                onClick={() => {
                setIsRegistering((prev) => !prev);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setError(null);
                }}
            >
                {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </p>
        </div>
    );
};

export default AuthForm;
