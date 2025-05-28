import { useState } from "react";
import style from "./ReviewForm.module.css";
import StarRatingBar from "../StarRatingBar";
import { Review, ReviewRequestType } from "../../types";
import { sendReview } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ReviewFormProps {
    productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");

    const email = useSelector((state: RootState) => state.auth.user!.email);

    const handleSubmit = () => {
        setText(text.trim());
        const reviewData: ReviewRequestType = {
            productId,
            stars: rating,
            text,
            email
        };

        sendReview(reviewData)
            .then(() => {
                setIsFormVisible(false);
                setText("");
                setRating(5);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Ошибка:", error.message);
                handleBack();
            });
        };

    const handleBack = () => {
        setIsFormVisible(false);
        setText("");
        setRating(5);
    };

    return (
        <div className={style.container}>
            {!isFormVisible ? (
                <button className={style.button} onClick={() => setIsFormVisible(true)}>
                    Оставить отзыв
                </button>
            ) : (
                <div className={style.form}>
                    <h3 className={style.form__title}>Оставьте отзыв:</h3>

                    <div className={`${style.form__section} ${style.form__section_rating}`}>
                        <p className={style.form__section__label}>Ваша оценка</p>
                        <StarRatingBar
                            rating={rating}
                            editable={true}
                            onChange={(value: number) => setRating(value)}
                        />
                    </div>

                    <div className={style.form__section}>
                        <p className={style.form__section__label}>Комментарий</p>
                        <textarea
                            className={style.form__section__textarea}
                            placeholder="Напишите, что вам понравилось или не понравилось"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className={style.form__actions}>
                        <button className={style.form__actions__submit} onClick={handleSubmit}>
                            Отправить
                        </button>
                        <p className={style.form__actions__back} onClick={handleBack}>
                            Назад
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;
