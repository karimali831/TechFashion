import { Box, CircularProgress, Icon, LinearProgress } from "@mui/material";
import { useState } from "react";
import {
    useGetCartQuery,
    useRemoveProductFromCartMutation,
    useUpdateProductQuantityMutation,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDInput from "src/components/MDInput";
import MDTypography from "src/components/MDTypography";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import "src/styles/scrollbars.css";

export const CartOverlay = () => {
    const [updating, setUpdating] = useState<number | null>(null);

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
            .then((payload) => {
                alert("success");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const removeItem = async (id: number) => {
        setUpdating(id);

        await removeProductFromCart(id)
            .unwrap()
            .then((payload) => {
                alert("success");
            })
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
            ) : (
                <Box overflow="hidden">
                    <MDTypography mb={1}>
                        <h2>Your cart</h2>
                    </MDTypography>

                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Box
                                mt={1}
                                mb={4}
                                display="flex"
                                paddingBottom={2}
                                alignItems="center"
                                justifyContent="space-between"
                                borderBottom="0.1rem solid rgba(18,18,18, .08)"
                                color="#121212BF"
                                fontSize={14}
                                overflow="hidden"
                            >
                                <span>Product</span>
                                <span>Total</span>
                            </Box>
                            <Box overflow="auto" height={600}>
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
                                                            width: 150,
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
                                                    height="100%"
                                                    justifyContent="space-evenly"
                                                >
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                    >
                                                        <MDTypography
                                                            component="label"
                                                            variant="button"
                                                            color="text"
                                                            fontWeight="medium"
                                                        >
                                                            {product.title}
                                                        </MDTypography>
                                                        <MDTypography
                                                            component="label"
                                                            variant="button"
                                                            color="text"
                                                            fontWeight="regular"
                                                        >
                                                            {updating ===
                                                            item.id ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                item.unitTotalStr
                                                            )}
                                                        </MDTypography>
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
                                                    {item.variationsList.map(
                                                        (variant, idx) => (
                                                            <MDTypography
                                                                variant="h7"
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
                                                        justifyContent="space-between"
                                                    >
                                                        <Box>
                                                            <Box
                                                                mb={1.5}
                                                                lineHeight={0}
                                                                display="inline-block"
                                                            >
                                                                <MDTypography
                                                                    component="label"
                                                                    variant="button"
                                                                    color="text"
                                                                    fontWeight="regular"
                                                                >
                                                                    Quantity
                                                                </MDTypography>
                                                            </Box>
                                                            <MDInput
                                                                inputProps={{
                                                                    type: "number",
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
                                                                variant="standard"
                                                            />
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
                                        );
                                    })}
                            </Box>
                        </Box>
                        <Box
                            overflow="hidden"
                            // padding="1.5rem 0"
                            borderTop="0.1rem solid rgba(18,18,18, .2)"
                        >
                            <Box
                                mt={2}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
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
                                <MDTypography
                                    variant="body2"
                                    color="text"
                                    fontWeight="strong"
                                    fontSize={16}
                                    mt={1}
                                    letterSpacing=".04rem"
                                >
                                    £42.26 GBP
                                </MDTypography>
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
                                onClick={() => console.log("checkout")}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
