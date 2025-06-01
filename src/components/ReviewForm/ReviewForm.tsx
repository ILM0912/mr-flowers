import { useState } from "react";
import style from "./ReviewForm.module.css";
import StarRatingBar from "../StarRatingBar";
import { Review, ReviewRequestType } from "../../types";
import { sendReview } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ReviewFormProps {
    productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");

    const email = useSelector((state: RootState) => state.auth.user!.email);

    const handleSubmit = () => {
        if (text.trim().length === 0 || text.length > 1000) {
            alert("Комментарий должен быть от 1 до 1000 символов");
            return;
        }
        if (rating < 1 || rating > 5) {
            alert("Оценка должна быть от 1 до 5");
            return;
        }
        setText(text.trim());
        const reviewData: ReviewRequestType = {
            productId,
            stars: rating,
            text,
            email
        };

        sendReview(reviewData)
            .then(() => {
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
                            maxLength={1000}
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
