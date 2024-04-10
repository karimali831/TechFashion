import { Box, CircularProgress, Fade, Icon } from "@mui/material";
import {
    useGetCartQuery,
    useRemoveProductFromCartMutation,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDTypography from "src/components/MDTypography";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import "./styles.css";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { getCartState } from "src/state/contexts/cart/Selectors";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
    OpenVerifyEmailModalAction,
    UpdatingProductIdAction,
} from "src/state/contexts/cart/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import { Page } from "src/enum/Page";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { ProductQuantity } from "../quantity";
import Swal from "sweetalert2";
import { SetStockAction } from "src/state/contexts/product/Actions";
import { RandomImages } from "src/layouts/pages/products/ProductItem";

interface IProps {
    isOverlay: boolean;
}

export const CartOverlay = ({ isOverlay }: IProps) => {
    const { user, firebaseUid, verificationEmail } =
        useAppSelector(getUserState);
    const { guestCheckout, updatingProductId } = useAppSelector(getCartState);

    const dispatch = useAppDispatch();

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });
    const { data: products, isLoading: loadingProducts } = useGetProductQuery();

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const [removeProductFromCart] = useRemoveProductFromCartMutation();

    const removeItem = async (id: number) => {
        dispatch(UpdatingProductIdAction(id));

        await removeProductFromCart(id)
            .unwrap()
            .then((payload) => {
                if (payload.errorMsg) {
                    Swal.fire({
                        icon: "error",
                        title: payload.errorMsg,
                    });
                } else {
                    const stock = payload.data === 0 ? null : payload.data;
                    dispatch(SetStockAction(stock));
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => dispatch(UpdatingProductIdAction(null)));
    };

    const onCheckoutClick = () => {
        dispatch(OpenCartOverlayAction(false));

        if (verificationEmail.verified) {
            dispatch(ShowPageAction(Page.Cart));
        } else if (user && !verificationEmail.verified) {
            dispatch(OpenVerifyEmailModalAction(true));
        } else {
            dispatch(OpenCartAccountModalAction(true));
        }
    };

    const onContinueShoppingClick = () => {
        // window.location.reload()
        dispatch(OpenCartOverlayAction(false));
        dispatch(ShowPageAction(Page.Products));
    };

    const randomNumber = Math.floor(Math.random() * RandomImages.length);

    return (
        <Box display="flex" flexDirection="column" height="100%">
            {loadingProducts ? (
                <Box>
                    <MDTypography>
                        <h2>Your cart</h2>
                        <CircularProgress />
                    </MDTypography>
                </Box>
            ) : itemsInCart.length === 0 ? (
                <Fade
                    in={true}
                    timeout={500}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <Box
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <h2 style={{ marginBottom: 10 }}>Your cart is empty</h2>
                        <ActionButton
                            size="large"
                            fullWidth={true}
                            text="Continue shopping"
                            onClick={onContinueShoppingClick}
                        />
                    </Box>
                </Fade>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <MDTypography>
                        <h2>Your cart</h2>
                    </MDTypography>

                    <Box
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                    >
                        <Box
                            mt={1}
                            mb={3}
                            display="flex"
                            paddingBottom={2}
                            alignItems="center"
                            justifyContent="space-between"
                            borderBottom="0.1rem solid rgba(18,18,18, .08)"
                            color="#121212BF"
                            fontSize={14}
                        >
                            <span>Product</span>
                            <span>Total</span>
                        </Box>
                        <Box overflow={"auto"} height="calc(100vh - 320px)">
                            {itemsInCart.length > 0 &&
                                itemsInCart.map((item, idx) => {
                                    const product = products.catalogue.find(
                                        (x) => x.id === item.productId
                                    );

                                    return (
                                        <Fade
                                            key={idx}
                                            in={true}
                                            timeout={500}
                                            mountOnEnter={true}
                                            unmountOnExit={true}
                                            style={{
                                                transitionDelay:
                                                    idx !== 0
                                                        ? idx * 100 + "ms"
                                                        : "0ms",
                                            }}
                                        >
                                            <Box
                                                key={item.id}
                                                mb={4}
                                                display="flex"
                                            >
                                                <Box mr={2}>
                                                    <img
                                                        // src={product.imageSrc}
                                                        src={
                                                            RandomImages[
                                                                randomNumber
                                                            ]
                                                        }
                                                        alt="Product Image"
                                                        style={{
                                                            width: 120,
                                                            height: "aspect-ratio: auto 150 / 150",
                                                            overflowClipMargin:
                                                                "content-box",
                                                            overflow: "clip",
                                                        }}
                                                    />
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    overflow="hidden"
                                                    width="100%"
                                                >
                                                    <Box
                                                        display="flex"
                                                        width={"100%"}
                                                        justifyContent="space-between"
                                                    >
                                                        <MDTypography
                                                            component="label"
                                                            variant="button"
                                                            color="text"
                                                            fontSize={15}
                                                            fontWeight="medium"
                                                            width={200}
                                                        >
                                                            {product.title}
                                                        </MDTypography>
                                                        {updatingProductId ===
                                                        item.id ? (
                                                            <CircularProgress
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <MDTypography
                                                                component="label"
                                                                variant="button"
                                                                color="text"
                                                                fontSize={15}
                                                                fontWeight="medium"
                                                            >
                                                                {
                                                                    item.unitTotalStr
                                                                }
                                                            </MDTypography>
                                                        )}
                                                    </Box>
                                                    <MDTypography
                                                        component="label"
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="regular"
                                                        mt={1}
                                                        mb={0.5}
                                                    >
                                                        {product.priceStr}
                                                    </MDTypography>
                                                    {item.variantList.map(
                                                        (variant, idx) => (
                                                            <MDTypography
                                                                variant="h7"
                                                                color="text"
                                                                key={idx}
                                                            >
                                                                {
                                                                    variant.attribute
                                                                }
                                                                {": " +
                                                                    variant.value}
                                                            </MDTypography>
                                                        )
                                                    )}

                                                    <Box
                                                        mt={1.5}
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        <ProductQuantity
                                                            item={item}
                                                        />
                                                        <Box
                                                            onClick={() =>
                                                                !updatingProductId &&
                                                                removeItem(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                sx={{
                                                                    ml: 5,
                                                                    cursor:
                                                                        !updatingProductId &&
                                                                        "pointer",
                                                                    color: "#121212",
                                                                }}
                                                                fontSize={
                                                                    "small"
                                                                }
                                                            >
                                                                delete_outline
                                                            </Icon>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    );
                                })}
                        </Box>
                    </Box>
                    {isOverlay && (
                        <Box
                            bgcolor={"white"}
                            borderTop="0.1rem solid rgba(18,18,18, .2)"
                        >
                            <Box
                                mt={2}
                                display="flex"
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <MDTypography
                                    variant="body2"
                                    color="text"
                                    fontWeight="strong"
                                    fontSize={18}
                                    letterSpacing=".04rem"
                                >
                                    Estimated total
                                </MDTypography>
                                <Fade
                                    in={true}
                                    mountOnEnter={true}
                                    unmountOnExit={true}
                                >
                                    <MDTypography
                                        variant="body2"
                                        color="text"
                                        fontWeight="strong"
                                        fontSize={18}
                                        mt={1}
                                        letterSpacing=".04rem"
                                    >
                                        {updatingProductId ? (
                                            <CircularProgress size={16} />
                                        ) : (
                                            cart.totalStr
                                        )}
                                    </MDTypography>
                                </Fade>
                            </Box>

                            <MDTypography
                                variant="body2"
                                color="text"
                                fontSize={14}
                                fontWeight={"regular"}
                                letterSpacing=".04rem"
                                mt={0.5}
                                mb={1}
                            >
                                Taxes, discounts and shipping calculated at
                                checkout
                            </MDTypography>

                            <ActionButton
                                fullWidth={true}
                                text={"check out"}
                                onClick={onCheckoutClick}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};
