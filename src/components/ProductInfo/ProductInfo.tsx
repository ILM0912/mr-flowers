import { DetailedProduct } from '../../types';
import { ReactComponent as LoadingIcon } from '../../images/loading.svg';
import { ReactComponent as EmptyIcon } from '../../images/empty.svg';
import style from './ProductInfo.module.css';
import CartButton from '../CartButton';
import { formatPrice } from '../../utils';
import { API_URL } from '../../api';
import Reviews from '../Reviews';
import { ReactComponent as StarActive } from "../../images/star-active.svg";


interface ProductInfoProps {
    product: DetailedProduct | null;
    loading: boolean;
}

const ProductInfo = ({ product, loading }: ProductInfoProps) => {
    if (loading) {
        return (
            <div className={style.container}>
                <div className={style.message}>
                    <LoadingIcon className={`${style.message__icon} ${style.message__icon_loading}`} />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={style.container}>
                <div className={style.message}>
                    <EmptyIcon className={style.message__icon} />
                    <div>Товар не найден</div>
                </div>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <div className={style.product}>
                <img
                    src={`${API_URL}/${product.image}`}
                    alt={product.name}
                    className={style.product__image}
                    loading="lazy"
                    draggable={false}
                />
                <div className={style.product__details}>
                    <h1 className={style.product__details__name}>{product.name}</h1>
                    <div>{formatPrice(product.price)}</div>
                    <p className={style.product__details__rating}>
                        {product.rating
                            ? [<StarActive className={style.product__details__rating__icon} />, product.rating.toFixed(1)]
                            : "нет отзывов"}
                    </p>
                    <CartButton product={product} />
                </div>
            </div>
            <div className={style.description}>
                <h2 className={style.description__title}>Описание товара:</h2>
                <p>{product.description}</p>
            </div>
            <Reviews product={product} />
        </div>
    );
};

export default ProductInfo;
