import { Product, popularProducts } from "src/assets/data/popular";

const PopularProducts = (): JSX.Element => {
    return (
        <div className="popular-products">
            <h1>Popular Products</h1>
            <div className="product-items">
                {popularProducts.map((item: Product) => {
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

export default PopularProducts;
