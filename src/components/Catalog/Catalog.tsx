import style from "./Catalog.module.css";
import { Product } from "../../types";
import Card from "../Card";
import { CatalogState } from "../CatalogController/CatalogController";

interface CatalogProps {
    products: Product[];
    catalogState: CatalogState;
}

const Catalog = ({ products, catalogState }: CatalogProps) => {
    return (
        <div className={style.container} data-cy={"catalog"}>
            {products.map((product) => (
                <Card key={product.id} product={product} catalogState={catalogState}/>
            ))}
        </div>
    );
};

export default Catalog;
