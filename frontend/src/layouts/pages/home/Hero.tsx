import { Page } from "src/enum/Page";
import { useAppDispatch } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";

const Hero = (): JSX.Element => {
    const dispatch = useAppDispatch();

    return (
        <div className="hero">
            <div className="top-content">
                <div className="new">
                    <h1>Sale</h1>
                    <h3>GET UP TO 25% OFF</h3>
                    <button
                        onClick={() => {
                            dispatch(ShowPageAction(Page.Products));
                        }}
                    >
                        shop now
                    </button>
                </div>
                <div className="collection">
                    <div className="collection-item" id="women">
                        <h5>New arrivals</h5>
                        <h3>women's</h3>
                    </div>
                    <div className="collection-item" id="men">
                        <h5>New arrivals</h5>
                        <h3>men's</h3>
                    </div>
                </div>
            </div>
            <div className="bottom-content">
                <div className="sale">
                    <h1>Sale</h1>
                    <p>Get upto 50% off</p>
                </div>
                <div className="free">
                    <p>buy 2 items</p>
                    <h1>get one for free</h1>
                </div>
                <div className="footwear">
                    <p>new arrivals</p>
                    <h1>footwear</h1>
                </div>
            </div>
        </div>
    );
};

export default Hero;
