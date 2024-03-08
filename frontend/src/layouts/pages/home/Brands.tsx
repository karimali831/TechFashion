import ckImg from "src/assets/img/ck.png";
import pradaImg from "src/assets/img/prada.png";
import gucciImg from "src/assets/img/gucci.png";
import vImg from "src/assets/img/v.png";
import Carousel from "react-material-ui-carousel";

export interface Brand {
    imgUrl: string;
    id: number;
    name: string;
}

export interface Options {
    margin: number;
    responsiveClass: boolean;
    autoWidth: boolean;
    loop: boolean;
    pullDrag: boolean;
    autoplay: boolean;
    autoplayHoverPause: boolean;
    autoHeight: boolean;
    smartSpeed: number;
    responsive: any;
}

const brandImgs: Brand[] = [
    {
        imgUrl: pradaImg,
        id: 1,
        name: "dg",
    },
    {
        imgUrl: ckImg,
        id: 2,
        name: "ck",
    },
    {
        imgUrl: pradaImg,
        id: 3,
        name: "prada",
    },
    {
        imgUrl: gucciImg,
        id: 4,
        name: "gucci",
    },
    {
        imgUrl: vImg,
        id: 5,
        name: "v",
    },
    {
        imgUrl: pradaImg,
        id: 6,
        name: "versache",
    },
    {
        imgUrl: vImg,
        id: 5,
        name: "v",
    },
];
const Brands = (): JSX.Element => {
    const sliderItems: number = brandImgs.length > 6 ? 6 : brandImgs.length;
    const items: Array<any> = [];

    for (let i = 0; i < brandImgs.length; i += sliderItems) {
        if (i % sliderItems === 0) {
            items.push(
                <div
                    key={i}
                    className="brand"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {brandImgs.slice(i, i + sliderItems).map((brand, index) => {
                        return (
                            <img
                                key={index}
                                src={brand.imgUrl}
                                alt={brand.name}
                                style={{ marginRight: 50 }}
                            />
                        );
                    })}
                </div>
            );
        }
    }

    return (
        <Carousel
            className="owl-carousel"
            autoPlay={true}
            animation="slide"
            duration={500}
            interval={6000}
            swipe={true}
        >
            {items}
        </Carousel>
    );
};

export default Brands;
