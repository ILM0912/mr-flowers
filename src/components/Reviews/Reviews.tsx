import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { DetailedProduct, Review } from "../../types";
import style from "./Reviews.module.css";
import { parseDate } from "../../utils";
import StarRatingBar from "../StarRatingBar";
import ReviewForm from "../ReviewForm";

interface ReviewsProps {
    product: DetailedProduct;
}

const Reviews = ({ product }: ReviewsProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const [canReview, setCanReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        if (user?.orders?.some((order) => order.items.some((item) => item.product.id === product.id))) {
            setCanReview(true);
        } else {
            setCanReview(false);
        }

        if (product.reviews?.some((review: Review) => review.email === user?.email)) {
            setHasReviewed(true);
        }
    }, []);

    return (
        <div className={style.container}>

            {!isAuthenticated ? (
                <p className={style.message}>Чтобы оставить отзыв, войдите в аккаунт.</p>
            ) : !canReview ? (
                <p className={style.message}>Оставлять отзывы могут только покупатели этого товара.</p>
            ) : hasReviewed ? (
                <p className={style.message}>Вы уже оставили отзыв на этот товар.</p>
            ) : (
                <ReviewForm productId={product.id} />
            )}

            <div className={style.reviews}>
                {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                    [...product.reviews]
                        .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
                        .map((review: Review) => (
                            <div key={review.id} className={style.reviews__item}>
                                <div className={style.reviews__item__info}>{review.author}</div>
                                <StarRatingBar rating={review.stars} />
                                <div>{review.text}</div>
                                <div>{review.date}</div>
                            </div>
                        ))
                ) : (
                    <div className={style.reviews__empty}>Отзывов пока нет</div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
