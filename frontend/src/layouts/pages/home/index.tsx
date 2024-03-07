import Hero from './Hero'
import './Home.css'
import Brands from './Brands'
import PopularProducts from './PopularProducts'
import Deals from './Deals'
import ProductsOnSale from './ProductsOnSale'
import Showcase from './Showcase'
const Home = (): JSX.Element => {
  return (
        <div className='home'>
            <Hero />
            <Brands />
            <PopularProducts />
            <Deals />
            <ProductsOnSale />
            <Showcase />
        </div>
  )
}

export default Home
