import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Catalog from "../Catalog";
import { Product, SortOrderTypes } from "../../types";
import { getProducts, getCategories } from "../../api";
import style from "./CatalogController.module.css";
import { ReactComponent as EmptyIcon } from '../../../src/images/empty.svg';
import { ReactComponent as ErrorIcon } from '../../../src/images/error.svg';
import { ReactComponent as LoadingIcon } from '../../../src/images/loading.svg';
import { useSearchParams } from "react-router-dom";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export type CatalogState = {
    sort: SortOrderTypes;
    filter: string;
    query: string;
}

const CatalogController = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    const initialFilter = searchParams.get("filter") || "all";
    const initialSortOrder = (searchParams.get("sort") as SortOrderTypes) || "rating";

	const [query, setQuery] = useState(initialQuery);
	const [filter, setFilter] = useState(initialFilter);
	const [sortOrder, setSortOrder] = useState<SortOrderTypes>(initialSortOrder);

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);

    const catalogLoading = loading;
    const cartLoading = useSelector((state : RootState) => !state.cart.loaded);

    const isLoading = catalogLoading || cartLoading;

	const [error, setError] = useState<string | null>(null);
	const [categories, setCategories] = useState<string[]>(["all"]);

	const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
	const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const hasRestored = useRef(false);
    const [catalogParams, setCatalogParams] = useState<CatalogState>({
        sort: sortOrder,
        filter,
        query: debouncedQuery
    });

    useEffect(() => {
        setCatalogParams({ sort: sortOrder, filter, query: debouncedQuery });
    }, [sortOrder, filter, debouncedQuery]);

    useLayoutEffect(() => {
        if (hasRestored.current) return;

        const savedState = sessionStorage.getItem("catalogState");
        const savedPosition = sessionStorage.getItem("scrollPosition");

        if (products.length === 0) return;
        
        if (!savedState) {
            window.scrollTo(0, 0);
            hasRestored.current = true;
            return;
        }

        const { sort: savedSort, filter: savedFilter, query: savedQuery } = JSON.parse(savedState);
        if (savedSort === sortOrder && savedFilter === filter && savedQuery === debouncedQuery) {
            if (savedPosition) {
                window.scrollTo(0, parseInt(savedPosition, 10));
            }
        } else {
            window.scrollTo(0, 0);
        }
        sessionStorage.removeItem("catalogState");
        sessionStorage.removeItem("scrollPosition");

        hasRestored.current = true;
    }, [products, sortOrder, filter, query]);


    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("query", debouncedQuery);
        if (sortOrder !== "rating") params.set("sort", sortOrder);
        if (filter !== "all") params.set("filter", filter);
        setSearchParams(params, { replace: true });
    }, [debouncedQuery, sortOrder, filter]);

	useEffect(() => {
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
            const normalized = query.toLowerCase().trim();
            setDebouncedQuery(normalized);
        }, 500);
        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [query]);

	useEffect(() => {
		setLoading(true);
		setError(null);

        getCategories()
			.then((data) => setCategories(["all", ...data]))
			.catch(() => setCategories(["all"]));

		getProducts()
			.then((data) => setProducts(data))
			.catch((error: any) => setError(error.message))
			.finally(() => setLoading(false));
	}, []);

	const handleReset = () => {
		setDebouncedQuery("");
        setQuery("");
		setFilter("all");
		setSortOrder("rating");
        window.scrollTo(0, 0);
	};

    const filteredAndSortedProducts = products
        .filter(product =>
            (filter === "all" || product.category === filter) &&
            product.name.toLowerCase().includes(debouncedQuery)
        )
        .sort((a, b) => {
            switch (sortOrder) {
                case "rating":
                    if (b.rating === a.rating) {
                        if (b.reviews_length === a.reviews_length) {
                            return a.name.localeCompare(b.name);
                        }
                        return b.reviews_length - a.reviews_length;
                    }
                    return b.rating - a.rating;

                case "asc":
                    if (a.price === b.price) {
                        if (b.rating === a.rating) {
                            return a.name.localeCompare(b.name);
                        }
                        return b.rating - a.rating;
                    }
                    return a.price - b.price;

                case "desc":
                    if (a.price === b.price) {
                        if (b.rating === a.rating) {
                            return a.name.localeCompare(b.name);
                        }
                        return b.rating - a.rating;
                    }
                    return b.price - a.price;

                case "alphabet":
                    return a.name.localeCompare(b.name);

                default:
                    return 0;
            }
        });


    return (
        <div className={style.container}>
            <div className={style.top}>
                <h1 className={style.top__title}>Каталог магазина MR Flowers</h1>

                <input
                    type="text"
                    className={style.top__input}
                    placeholder="Поиск товара по названию"
                    value={query}
                    onChange={(e) => {
                            setQuery(e.target.value);
                            window.scrollTo(0, 0);
                        }
                    }
                />

                <div className={style.top__controls}>
                    <select
                        className={style.top__controls__select}
                        value={sortOrder}
                        onChange={(e) => {
                                setSortOrder(e.target.value as SortOrderTypes);
                                window.scrollTo(0, 0);
                            }
                        }
                    >
                        <option value="rating">По рейтингу</option>
                        <option value="asc">Сначала дешевые</option>
                        <option value="desc">Сначала дорогие</option>
                        <option value="alphabet">По алфавиту</option>
                    </select>

                    <select
                        className={style.top__controls__select}
                        value={filter}
                        onChange={(e) => {
                                setFilter(e.target.value);
                                window.scrollTo(0, 0);
                            }
                        }
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "all" ? "Все категории" : category}
                            </option>
                        ))}
                    </select>

                    <button
                        className={`${style.top__controls__reset} ${(query || filter !== "all" || sortOrder !== "rating") ? style.top__controls__reset_enabled : style.top__controls__reset_disabled}`}
                        onClick={() => {
                            if (query || filter !== "all" || sortOrder !== "rating") {
                                handleReset();
                            }
                        }}
                    >
                        <svg
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            className={style.top__controls__reset__icon}
                        >
                            <path d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 Z"
                            transform="translate(-568 -1087)" />
                        </svg>
                    </button>
                </div>
            </div>


            <div className={style.result}>
                {isLoading ? (
                    <div className={style.result__message}>
                        <LoadingIcon className={`${style.result__message__icon} ${style.result__message__icon_loading}`} />
                    </div>
                ) : error ? (
                    <div className={style.result__message}>
                        <ErrorIcon className={style.result__message__icon} />
                        <div>{error}</div>
                    </div>
                ) : !filteredAndSortedProducts.length ? (
                    <div className={style.result__message}>
                        <EmptyIcon className={style.result__message__icon} />
                        <div>Нет подходящих товаров</div>
                    </div>
                ) : (
                    <Catalog
						products={filteredAndSortedProducts}
                        catalogState={catalogParams}
					/>
                )}
            </div>
        </div>
    );
};

export default CatalogController;
