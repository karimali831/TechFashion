import {
    Box,
    CircularProgress,
    Fade,
    Icon,
    LinearProgress,
} from "@mui/material";
import { useState } from "react";
import {
    useGetCartQuery,
    useRemoveProductFromCartMutation,
    useUpdateProductQuantityMutation,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDTypography from "src/components/MDTypography";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import "./styles.css";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { MDModal } from "src/components/MDModal";
import MDInput from "src/components/MDInput";
import { getCartState } from "src/state/contexts/cart/Selectors";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
} from "src/state/contexts/cart/Actions";

interface IProductCartQuantity {
    id: number;
    quantity: number;
}

interface IProps {
    isOverlay: boolean;
}

export const CartOverlay = ({ isOverlay }: IProps) => {
    const [updating, setUpdating] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<IProductCartQuantity | null>(null);
    // const [email, setEmail] = useState<string>("");

    const { guestCheckoutId } = useAppSelector(getCartState);
    const dispatch = useAppDispatch();

    const { data: cart } = useGetCartQuery({
        firebaseUid: null,
        guestCheckoutId,
    });
    const { data: products, isLoading: loadingProducts } = useGetProductQuery();

    // const dispatch = useAppDispatch();

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const [updateProductQuantity, { isLoading: updatingProductQuantity }] =
        useUpdateProductQuantityMutation();

    const [removeProductFromCart, { isLoading: removingProduct }] =
        useRemoveProductFromCartMutation();

    // const navigate = useNavigate();

    useEffectSkipInitialRender(() => {
        if (!updatingProductQuantity && !removingProduct && updating) {
            setUpdating(null);
        }
    }, [updatingProductQuantity, removingProduct]);

    const onQuantityChange = async (
        id: number,
        quantity: number,
        stock?: number
    ) => {
        if (updatingProductQuantity || quantity === 0) return;

        if (quantity) setUpdating(id);
        await updateProductQuantity({
            id,
            quantity,
        })
            .unwrap()
            .then((payload) => {})
            .catch((error) => {
                console.error(error);
            });
    };

    const removeItem = async (id: number) => {
        setUpdating(id);

        await removeProductFromCart(id)
            .unwrap()
            .then((payload) => {})
            .catch((error) => {
                console.error(error);
            });
    };

    const onCheckoutClick = () => {
        dispatch(OpenCartOverlayAction(false));
        dispatch(OpenCartAccountModalAction(true));
    };

    if (loadingProducts) {
        return <LinearProgress />;
    }

    return (
        <Box display="flex" flexDirection="column" height="100%">
            {itemsInCart.length === 0 ? (
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
                            text="Continue shopping"
                            onClick={() => window.location.reload()}
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
                            // mt={1}
                            mb={4}
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
                                                        src={product.imageSrc}
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
                                                            fontWeight="medium"
                                                            width={200}
                                                        >
                                                            {product.title}
                                                        </MDTypography>
                                                        {updating ===
                                                        item.id ? (
                                                            <CircularProgress
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <MDTypography
                                                                component="label"
                                                                variant="button"
                                                                color="text"
                                                                fontWeight="regular"
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
                                                        mb={1}
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
                                                        mt={2}
                                                        display="flex"
                                                        alignItems="center"
                                                        // justifyContent="space-between"
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                border: "1px solid darkgrey",
                                                                width: 150,
                                                                height: 47,
                                                                borderRadius: 0,
                                                            }}
                                                        >
                                                            <Box
                                                                display="flex"
                                                                justifyContent="space-evenly"
                                                                alignItems="center"
                                                                width="100%"
                                                            >
                                                                <Icon
                                                                    style={{
                                                                        color:
                                                                            item.quantity ===
                                                                            1
                                                                                ? "#333"
                                                                                : "#000",
                                                                        cursor:
                                                                            item.quantity !==
                                                                                1 &&
                                                                            "pointer",
                                                                    }}
                                                                    onClick={() => {
                                                                        if (
                                                                            item.quantity ==
                                                                            1
                                                                        )
                                                                            return;

                                                                        const quantity =
                                                                            item.quantity -
                                                                            1;

                                                                        if (
                                                                            item.stock &&
                                                                            quantity >
                                                                                item.stock
                                                                        ) {
                                                                            return;
                                                                        }
                                                                        setQuantity(
                                                                            {
                                                                                id: item.id,
                                                                                quantity,
                                                                            }
                                                                        );
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            quantity,
                                                                            item.stock
                                                                        );
                                                                    }}
                                                                >
                                                                    remove
                                                                </Icon>
                                                                <Box>
                                                                    <input
                                                                        type="number"
                                                                        style={{
                                                                            position:
                                                                                "relative",
                                                                            width: 40,
                                                                            border: 0,
                                                                            outline: 0,
                                                                            fontSize: 20,
                                                                            marginBottom: 6,
                                                                            marginRight: 6,
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                        disabled={
                                                                            !!updating
                                                                        }
                                                                        value={
                                                                            quantity?.id ===
                                                                            item.id
                                                                                ? quantity.quantity
                                                                                : item.quantity
                                                                        }
                                                                        onChange={(
                                                                            e: React.ChangeEvent<HTMLInputElement>
                                                                        ) => {
                                                                            const value =
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );

                                                                            if (
                                                                                value ===
                                                                                0
                                                                            )
                                                                                return;

                                                                            setQuantity(
                                                                                {
                                                                                    id: item.id,
                                                                                    quantity:
                                                                                        value,
                                                                                }
                                                                            );
                                                                        }}
                                                                        onBlur={(
                                                                            e: React.ChangeEvent<HTMLInputElement>
                                                                        ) => {
                                                                            const value =
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );

                                                                            if (
                                                                                value ===
                                                                                0
                                                                            )
                                                                                return;

                                                                            onQuantityChange(
                                                                                item.id,
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ),
                                                                                item.stock
                                                                            );
                                                                        }}
                                                                    />
                                                                    {item.stock && (
                                                                        <span
                                                                            style={{
                                                                                position:
                                                                                    "relative",
                                                                                right: "25%",
                                                                            }}
                                                                        >
                                                                            {"/ " +
                                                                                item.stock}
                                                                        </span>
                                                                    )}
                                                                </Box>
                                                                <Icon
                                                                    sx={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => {
                                                                        const quantity =
                                                                            item.quantity +
                                                                            1;

                                                                        if (
                                                                            item.stock &&
                                                                            quantity >
                                                                                item.stock
                                                                        ) {
                                                                            return;
                                                                        }

                                                                        setQuantity(
                                                                            {
                                                                                id: item.id,
                                                                                quantity,
                                                                            }
                                                                        );
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            quantity,
                                                                            item.stock
                                                                        );
                                                                    }}
                                                                >
                                                                    add
                                                                </Icon>
                                                            </Box>
                                                        </Box>
                                                        <Box
                                                            onClick={() =>
                                                                !updating &&
                                                                removeItem(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                sx={{
                                                                    ml: 5,
                                                                    cursor:
                                                                        !updating &&
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
                                    fontSize={16}
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
                                        fontSize={16}
                                        mt={1}
                                        letterSpacing=".04rem"
                                    >
                                        {cart.totalStr}
                                    </MDTypography>
                                </Fade>
                            </Box>

                            <MDTypography
                                variant="body2"
                                color="text"
                                fontSize={14}
                                fontWeight={"regular"}
                                letterSpacing=".04rem"
                                mt={1}
                                mb={1}
                            >
                                Taxes, discounts and shipping calculated at
                                checkout
                            </MDTypography>

                            <ActionButton
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
