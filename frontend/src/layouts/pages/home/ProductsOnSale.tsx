import { Product, onsaleProducts } from "src/assets/data/popular";

const ProductsOnSale = (): JSX.Element => {
    return (
        <div className="onsale-products">
            <h1>On Sale Products</h1>
            <div className="product-items">
                {onsaleProducts.map((item: Product) => {
                    return (
                        <div className="product-item" key={item.id}>
                            <img src={item.img} alt={item.description} />
                            <p>{item.description}</p>
                            <h6>
                                <strong>{item.price}</strong>
                            </h6>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductsOnSale;
