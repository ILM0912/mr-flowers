import { memo } from "react";
import { Product } from "../../types";
import style from "./Card.module.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../../src/api";
import CartButton from "../CartButton";
import { formatPrice } from "../../utils";
import { ReactComponent as StarActive } from "../../images/star-active.svg";
import { CatalogState } from "../CatalogController/CatalogController";

interface CardProps {
    product: Product;
    catalogState : CatalogState
}

const Card = ({ product, catalogState }: CardProps) => {
    return (
        <div className={style.container}>
            <Link to={`/product/${product.id}`}
                className={style["card-link"]}
                data-cy={`product_${product.id}`}
                onClick={() => {
                    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
                    sessionStorage.setItem("catalogState", JSON.stringify(catalogState));
                }}
            >
                <div className={style["card-link__image-wrapper"]}>
                    <img
                        src={`${API_URL}/${product.image}`}
                        alt={product.name}
                        className={style["card-link__image-wrapper__image"]}
                        loading="lazy"
                        draggable={false}
                    />
                </div>
                <div className={style["card-link__main-info"]}>
                    {product.name}
                </div>
                <div className={style["card-link__main-info"]}>
                    {formatPrice(product.price)}
                </div>
                <p className={style["card-link__rating"]}>
                    {product.rating
                        ? [<StarActive className={style["card-link__rating__icon"]} />, product.rating.toFixed(1)]
                        : "нет отзывов"}
                </p>
                </Link>
            <CartButton product={product}/>
        </div>
    );
};

export default memo(Card, (prev, next) =>
    prev.product.id === next.product.id &&
    JSON.stringify(prev.catalogState) === JSON.stringify(next.catalogState)
);
