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

interface IProductCartQuantity {
    id: number;
    quantity: number;
}

export const CartOverlay = () => {
    const [updating, setUpdating] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<IProductCartQuantity | null>(null);

    const { data: cart } = useGetCartQuery();
    const { data: products, isLoading: loadingProducts } = useGetProductQuery();

    // const cartId = 1;
    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const [updateProductQuantity, { isLoading: updatingProductQuantity }] =
        useUpdateProductQuantityMutation();

    // const [addProductToCart, { isLoading: addingProduct }] =
    //     useAddProductToCartMutation();

    const [removeProductFromCart, { isLoading: removingProduct }] =
        useRemoveProductFromCartMutation();

    useEffectSkipInitialRender(() => {
        if (!updatingProductQuantity && !removingProduct && updating) {
            setUpdating(null);
        }
    }, [updatingProductQuantity, removingProduct]);

    const onQuantityChange = async (id: number, quantity: number) => {
        if (updatingProductQuantity) return;

        setUpdating(id);
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
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        height="100%"
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
                <Box sx={{ height: "100%" }}>
                    <MDTypography mb={1}>
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
                            // overflow="hidden"
                        >
                            <span>Product</span>
                            <span>Total</span>
                        </Box>
                        <Box overflow="auto" height="calc(100vh - 300px)">
                            {itemsInCart.length > 0 &&
                                itemsInCart.map((item, idx) => {
                                    const product = products.catalogue.find(
                                        (x) => x.id === item.productId
                                    );

                                    // const productDetails =
                                    //     products.details.filter(
                                    //         (x) => x.id === item.productId
                                    //     );

                                    return (
                                        <Fade
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
                                                        justifyContent="space-between"
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
                                                                        setQuantity(
                                                                            {
                                                                                id: item.id,
                                                                                quantity:
                                                                                    item.quantity -
                                                                                    1,
                                                                            }
                                                                        );
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            item.quantity -
                                                                                1
                                                                        );
                                                                    }}
                                                                >
                                                                    remove
                                                                </Icon>
                                                                <input
                                                                    type="number"
                                                                    style={{
                                                                        width: 40,
                                                                        border: 0,
                                                                        outline: 0,
                                                                        fontSize: 20,
                                                                        marginBottom: 6,
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
                                                                    ) =>
                                                                        setQuantity(
                                                                            {
                                                                                id: item.id,
                                                                                quantity:
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ),
                                                                            }
                                                                        )
                                                                    }
                                                                    onBlur={(
                                                                        e: React.ChangeEvent<HTMLInputElement>
                                                                    ) => {
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        );
                                                                    }}
                                                                />

                                                                {/* <MDTypography fontSize="medium">
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </MDTypography> */}
                                                                <Icon
                                                                    sx={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => {
                                                                        setQuantity(
                                                                            {
                                                                                id: item.id,
                                                                                quantity:
                                                                                    item.quantity +
                                                                                    1,
                                                                            }
                                                                        );
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            item.quantity +
                                                                                1
                                                                        );
                                                                    }}
                                                                >
                                                                    add
                                                                </Icon>
                                                            </Box>
                                                        </Box>

                                                        {/* <MDInput
                                                                inputProps={{
                                                                    type: "number",
                                                                    width: 100,
                                                                    disabled:
                                                                        !!updating,
                                                                    onChange: (
                                                                        e: React.ChangeEvent<HTMLInputElement>
                                                                    ) =>
                                                                        onQuantityChange(
                                                                            item.id,
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        ),
                                                                }}
                                                                value={
                                                                    item.quantity
                                                                }
                                                                size="small"
                                                                variant="standard"
                                                            /> */}
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
                                                                    cursor:
                                                                        !updating &&
                                                                        "pointer",
                                                                    color: "#121212",
                                                                }}
                                                                fontSize={
                                                                    "medium"
                                                                }
                                                            >
                                                                delete
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
                    <Box
                        // overflow="hidden"
                        display="flex"
                        flexDirection={"column"}
                        justifyContent={"flex-end"}
                        sx={{ position: "absolute", bottom: 15 }}
                        // padding="1.5rem 0"
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
                            Taxes, discounts and shipping calculated at checkout
                        </MDTypography>

                        <ActionButton
                            text={"check out"}
                            onClick={() => console.log("checkout")}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
};
