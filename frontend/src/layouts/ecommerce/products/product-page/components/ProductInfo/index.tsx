import { Box, Fade, LinearProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import {
    useAddProductToCartMutation,
    useGetCartQuery,
    useUpdateProductQuantityMutation,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDAlert from "src/components/MDAlert";
import MDBadge from "src/components/MDBadge";
import MDBox from "src/components/MDBox";
import MDInput from "src/components/MDInput";
import MDTypography from "src/components/MDTypography";
import { IVariant } from "src/data/IVariant";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { IProductDetail } from "src/interface/IProductDetail";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { OpenCartOverlayAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { getUserState } from "src/state/contexts/user/Selectors";

interface IProps {
    item: IProductDetail[];
}

interface IProductVariableUnavailable {
    reason: "out-of-stock" | "deleted" | "quantity-exceeds-stock";
    text: string;
}

function ProductInfo({ item }: IProps): JSX.Element {
    const [quantity, setQuantity] = useState<number>(1);
    const [variations, setVariations] = useState<IVariant[]>([]);
    const [productVariantUnavailable, setProductVariantUnavailable] =
        useState<IProductVariableUnavailable | null>(null);

    const [addProductToCart, { isLoading: adding }] =
        useAddProductToCartMutation();
    const [updateProductQuantity] = useUpdateProductQuantityMutation();

    const { firebaseUid } = useAppSelector(getUserState);
    const { guestCheckout } = useAppSelector(getCartState);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const { data: products } = useGetProductQuery();

    const dispatch = useAppDispatch();

    const variants = products.variants.filter(
        (x) => x.productId === item[0].id
    );

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const product =
        item.filter(
            (x) => !x.variantId || isEqual(x.variantList, variations)
        )[0] ?? item[0];

    let itemInCart = itemsInCart.filter((x) =>
        item.some(
            (i) =>
                i.id === x.productId &&
                (!i.variantId || isEqual(x.variantList, variations))
        )
    )[0];

    useEffect(() => {
        setVariations(
            variants.map((x) => {
                return {
                    attribute: x.attribute,
                    value: x.options[0],
                };
            })
        );
    }, [products]);

    useEffectSkipInitialRender(() => {
        const productVariant = item.filter((x) =>
            isEqual(x.variantList, variations)
        )[0];

        if (!productVariant) {
            setProductVariantUnavailable({
                reason: "deleted",
                text: "Variant not currently available, please make another selection.",
            });
        } else {
            if (productVariant.stock === 0) {
                setProductVariantUnavailable({
                    reason: "out-of-stock",
                    text: "Out of stock, please make another selection.",
                });
            } else if (
                itemInCart?.stock &&
                itemInCart.stock < itemInCart.quantity + quantity
            ) {
                setProductVariantUnavailable({
                    reason: "quantity-exceeds-stock",
                    text:
                        "You already have " +
                        itemInCart.quantity +
                        " in your cart and cannot add no more.",
                });
            } else {
                setProductVariantUnavailable(null);
            }
        }
    }, [variations, itemInCart]);

    const addToCart = async () => {
        if (itemInCart) {
            const totalQuantity = itemInCart.quantity + quantity;

            if (itemInCart.stock && itemInCart.stock < totalQuantity) {
                setProductVariantUnavailable({
                    reason: "quantity-exceeds-stock",
                    text:
                        "You already have " +
                        itemInCart.stock +
                        " in your cart and cannot add no more.",
                });
                return;
            }

            await updateProductQuantity({
                id: itemInCart.id,
                quantity: totalQuantity,
            })
                .unwrap()
                .then((payload) => {
                    dispatch(OpenCartOverlayAction(true));
                    setQuantity(1);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            await addProductToCart({
                cartUser: {
                    firebaseUid,
                    guestCheckoutId: guestCheckout?.id,
                },
                quantity,
                productId: product.id,
                variantId: product?.variantId,
            })
                .unwrap()
                .then((payload) => {
                    dispatch(OpenCartOverlayAction(true));
                    setQuantity(1);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const updateVariant = (key: string, value: string) => {
        setVariations(
            variations.map((v) => (v.attribute === key ? { ...v, value } : v))
        );
    };

    const updateQuantity = (value: number) => {
        if (value == 0) return;

        if (
            (product.stock && product.stock < value) ||
            (itemInCart?.stock && itemInCart.stock < value)
        ) {
            setProductVariantUnavailable({
                reason: "quantity-exceeds-stock",
                text:
                    itemInCart?.stock && itemInCart.stock < value
                        ? "You already have " +
                          itemInCart.stock +
                          " in your cart and cannot add no more."
                        : "Please select a maximum quantity of " +
                          product.stock,
            });
        } else {
            if (productVariantUnavailable.reason === "quantity-exceeds-stock") {
                setProductVariantUnavailable(null);
            }
        }

        setQuantity(value);
    };

    if (!product || (product.variantId && variations.length === 0))
        return <LinearProgress />;

    return (
        <MDBox>
            <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                    {product.title}
                </MDTypography>
            </MDBox>
            <MDTypography variant="h4" color="text">
                <Icon>star</Icon>
                <Icon>star</Icon>
                <Icon>star</Icon>
                <Icon>star</Icon>
                <Icon>star_half</Icon>
            </MDTypography>
            <MDBox mt={1}>
                <MDTypography variant="h6" fontWeight="medium">
                    Price
                </MDTypography>
            </MDBox>
            <MDBox mb={1}>
                <MDTypography variant="h5" fontWeight="medium">
                    {product.priceStr}
                </MDTypography>
            </MDBox>
            {!!productVariantUnavailable &&
            productVariantUnavailable.reason !== "quantity-exceeds-stock" ? (
                <MDBadge
                    variant="contained"
                    color="error"
                    badgeContent={
                        productVariantUnavailable.reason === "out-of-stock"
                            ? "out of stock"
                            : "unavailable"
                    }
                    container
                />
            ) : (
                <MDBadge
                    variant="contained"
                    color="success"
                    badgeContent={
                        (product.stock ? product.stock : "") + " in stock"
                    }
                    container
                />
            )}
            <MDBox mt={3} mb={1} ml={0.5}>
                <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                >
                    Description
                </MDTypography>
            </MDBox>
            <MDBox component="ul" m={0} pl={4} mb={2}>
                <MDBox color="text" fontSize="1.25rem" lineHeight={1}>
                    <MDTypography
                        variant="body2"
                        color="text"
                        fontWeight="regular"
                        verticalAlign="middle"
                    >
                        {product.description}
                    </MDTypography>
                </MDBox>
                {/* <MDBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
                    <MDTypography variant="body2" color="text" fontWeight="regular" verticalAlign="middle">
                        Memory swivel seat returns to original seat position
                    </MDTypography>
                </MDBox>
                <MDBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
                    <MDTypography variant="body2" color="text" fontWeight="regular" verticalAlign="middle">
                        Comfortable integrated layered chair seat cushion design
                    </MDTypography>
                </MDBox>
                <MDBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
                    <MDTypography variant="body2" color="text" fontWeight="regular" verticalAlign="middle">
                        Fully assembled! No assembly required
                    </MDTypography>
                </MDBox> */}
            </MDBox>
            <MDBox mt={3}>
                {productVariantUnavailable && (
                    <Fade in={true} mountOnEnter={true} unmountOnExit={true}>
                        <Box>
                            <MDAlert dismissible={true} color="warning">
                                <Icon sx={{ mr: 1 }}>warning</Icon>
                                {productVariantUnavailable.text}
                            </MDAlert>
                        </Box>
                    </Fade>
                )}
                <Fade
                    in={true}
                    timeout={500}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <Grid container spacing={3}>
                        {variants.map((variant, idx) => {
                            const selectedVariant = variations.filter(
                                (x) => x.attribute === variant.attribute
                            )[0]?.value;

                            return (
                                <Grid key={idx} item xs={12} lg={5}>
                                    <MDBox
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
                                            {variant.attribute}
                                        </MDTypography>
                                    </MDBox>
                                    <Autocomplete
                                        value={selectedVariant}
                                        options={variant.options}
                                        onChange={(
                                            e: React.SyntheticEvent,
                                            value: string
                                        ) =>
                                            updateVariant(
                                                variant.attribute,
                                                value
                                            )
                                        }
                                        renderInput={(params) => (
                                            <MDInput
                                                {...params}
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>
                            );
                        })}

                        <Grid item xs={12} lg={5}>
                            <MDBox mb={1.5} lineHeight={0}>
                                <MDTypography
                                    component="label"
                                    variant="button"
                                    color="text"
                                    fontWeight="regular"
                                >
                                    Quantity{" "}
                                    {itemInCart &&
                                        `(${itemInCart.quantity} in cart)`}
                                </MDTypography>
                            </MDBox>
                            <MDInput
                                inputProps={{
                                    type: "number",
                                    style: { width: 150 },
                                    onChange: (
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => updateQuantity(Number(e.target.value)),
                                }}
                                value={quantity}
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </Fade>
            </MDBox>
            <MDBox mt={3}>
                <Grid item xs={12} lg={5} container>
                    <ActionButton
                        disabled={quantity === 0 || !!productVariantUnavailable}
                        loading={adding}
                        text="add to cart"
                        onClick={addToCart}
                    />
                </Grid>
            </MDBox>
        </MDBox>
    );
}

export default ProductInfo;
