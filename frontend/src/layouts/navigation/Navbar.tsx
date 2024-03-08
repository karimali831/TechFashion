import { Link, type NavigateFunction, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBalanceScale, FaUserAlt } from "react-icons/fa";
import { navData } from "src/assets/data/navData";
import "./styles.css";
// import { useAppSelector } from "src/state/Hooks";

const Navbar = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();
    // const { isLoggedIn, user } = useAppSelector((store: any) => store.auth);
    return (
        <div className="navbar">
            <div className="logo">
                <img
                    src="src/assets/img/logo.png"
                    alt="Tech Fashion"
                    className="logo-img"
                />
                <h1
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Tech Fashion
                </h1>
            </div>
            <div className="nav-links">
                {navData.map((item, idx) => (
                    <ul key={idx}>
                        <Link to={item.url} className="navLinkItem">
                            {item.name}
                        </Link>
                    </ul>
                ))}
            </div>

            <div className="nav-action">
                <p
                    onClick={() => {
                        navigate("/cart");
                    }}
                >
                    <i>
                        <FaShoppingCart />
                    </i>
                </p>
                <p
                    onClick={() => {
                        navigate("/comparison");
                    }}
                >
                    <i>
                        <FaBalanceScale />
                    </i>
                </p>
                <p
                    onClick={() => {
                        navigate("/login");
                    }}
                    id="auth-icon"
                >
                    <i>
                        <FaUserAlt />
                    </i>{" "}
                    Account
                    {/* {isLoggedIn ? user.firstName : "Account"} */}
                </p>
            </div>
        </div>
    );
};
export default Navbar;
