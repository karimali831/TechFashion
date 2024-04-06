import { Box, Fade, Skeleton } from "@mui/material";
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
import MDBadge from "src/components/MDBadge";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { IVariant } from "src/data/IVariant";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { IProductDetail } from "src/interface/IProductDetail";
import { Variant } from "src/layouts/ecommerce/variant";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { OpenCartOverlayAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { SetStockAction } from "src/state/contexts/product/Actions";
import { getProductState } from "src/state/contexts/product/Selectors";
import { getUserState } from "src/state/contexts/user/Selectors";
import Swal from "sweetalert2";

interface IProps {
    item: IProductDetail[];
    loading: boolean;
}

function ProductInfo({ item, loading }: IProps): JSX.Element {
    const [quantity, setQuantity] = useState<number>(1);
    const [variations, setVariations] = useState<IVariant[]>([]);

    const [addProductToCart, { isLoading: adding }] =
        useAddProductToCartMutation();
    const [updateProductQuantity, { isLoading: updating }] =
        useUpdateProductQuantityMutation();

    const { firebaseUid } = useAppSelector(getUserState);
    const { guestCheckout } = useAppSelector(getCartState);
    const { stock } = useAppSelector(getProductState);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const { data: products, isLoading: loadingProducts } = useGetProductQuery();

    const dispatch = useAppDispatch();

    const variants = products?.variants.filter(
        (x) => x.productId === item[0]?.id
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
            variants?.map((x) => {
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
            dispatch(SetStockAction(0));
            setQuantity(1);
        } else {
            if (productVariant.stock === 0) {
                dispatch(SetStockAction(0));
            } else if (
                itemInCart?.stock &&
                itemInCart.quantity + quantity > product.stock
            ) {
                dispatch(SetStockAction(0));
            } else {
                dispatch(SetStockAction(product.stock));
            }
        }
        // }, []);
    }, [variations]);

    const addToCart = async () => {
        if (itemInCart) {
            const totalQuantity = itemInCart.quantity + quantity;

            await updateProductQuantity({
                id: itemInCart.id,
                quantity: totalQuantity,
                replinish: false,
            })
                .unwrap()
                .then((payload) => {
                    if (payload.errorMsg) {
                        Swal.fire({
                            icon: "error",
                            title: payload.errorMsg,
                        });
                        dispatch(SetStockAction(0));
                    } else {
                        dispatch(SetStockAction(payload.data));
                        dispatch(OpenCartOverlayAction(true));
                    }
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
                variantId: product.variantId,
            })
                .unwrap()
                .then((payload) => {
                    if (payload.errorMsg) {
                        Swal.fire({
                            icon: "error",
                            title: payload.errorMsg,
                        });
                        dispatch(SetStockAction(0));
                    } else {
                        dispatch(SetStockAction(payload.data));
                        dispatch(OpenCartOverlayAction(true));
                    }

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

        if (itemInCart?.stock && itemInCart.quantity + value > product.stock) {
            dispatch(SetStockAction(0));
        } else if (product.stock && value > product.stock) {
            dispatch(SetStockAction(0));
        } else {
            dispatch(SetStockAction(product.stock));
        }

        setQuantity(value);
    };

    return (
        <Fade
            in={true}
            timeout={500}
            mountOnEnter={true}
            unmountOnExit={true}
            style={{
                transitionDelay: "100ms",
            }}
        >
            <MDBox>
                <MDBox mb={1}>
                    {loading || loadingProducts ? (
                        <Box>
                            <Skeleton
                                animation="wave"
                                width="100%"
                                height={25}
                                variant="rectangular"
                            />
                            <Skeleton
                                animation="pulse"
                                width="50%"
                                height={20}
                                style={{ marginTop: 5 }}
                                variant="rounded"
                            />
                        </Box>
                    ) : (
                        <MDTypography variant="h3" fontWeight="bold">
                            {product?.title}
                        </MDTypography>
                    )}
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
                    {loading ? (
                        <Skeleton
                            animation="pulse"
                            width="25%"
                            height={20}
                            variant="rectangular"
                        />
                    ) : (
                        <MDTypography variant="h5" fontWeight="medium">
                            {product?.priceStr}
                        </MDTypography>
                    )}
                </MDBox>
                {loading ? null : stock === 0 ? (
                    <MDBadge
                        variant="contained"
                        color="error"
                        badgeContent={"unavailable"}
                        container
                    />
                ) : (
                    <MDBadge
                        variant="contained"
                        color="success"
                        badgeContent={
                            (stock === null ? "" : stock) + " in stock"
                        }
                        container
                    />
                )}

                <MDBox mt={3}>
                    <Fade
                        in={true}
                        timeout={500}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <Box>
                            {loading ? (
                                <Skeleton
                                    width={"75%"}
                                    height={100}
                                    animation="pulse"
                                    variant="rounded"
                                />
                            ) : (
                                variants?.map((variant, idx) => {
                                    const selectedVariant = variations?.filter(
                                        (x) => x.attribute === variant.attribute
                                    )[0]?.value;

                                    return (
                                        <Grid key={idx} item xs={12} lg={5}>
                                            <Variant
                                                selected={selectedVariant}
                                                variant={variant}
                                                onClick={(value) => {
                                                    updateVariant(
                                                        variant.attribute,
                                                        value
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    );
                                })
                            )}
                            {!loading && (
                                <Box>
                                    <MDBox mb={1} mt={4} lineHeight={0}>
                                        {/* {productVariantUnavailable && (
                                    <Fade
                                        timeout={500}
                                        in={true}
                                        mountOnEnter={true}
                                        unmountOnExit={true}
                                    >
                                        <Box mt={3}>
                                            <MDAlert color="warning">
                                                <Icon sx={{ mr: 1 }}>
                                                    warning
                                                </Icon>
                                                {productVariantUnavailable.text}
                                            </MDAlert>
                                        </Box>
                                    </Fade>
                                )} */}
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

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-evenly",
                                            border: "1px solid darkgrey",
                                            width: 150,
                                            height: 47,
                                            borderRadius: 0,
                                        }}
                                    >
                                        <Icon
                                            style={{
                                                color:
                                                    quantity === 1
                                                        ? "#333"
                                                        : "#000",
                                                cursor:
                                                    quantity !== 1 && "pointer",
                                            }}
                                            onClick={() => {
                                                if (quantity == 1) return;
                                                updateQuantity(quantity - 1);
                                            }}
                                        >
                                            remove
                                        </Icon>
                                        <Box>
                                            <input
                                                type="number"
                                                style={{
                                                    position: "relative",
                                                    width: 40,
                                                    border: 0,
                                                    outline: 0,
                                                    fontSize: 20,
                                                    marginBottom: 6,
                                                    marginRight: 6,
                                                    textAlign: "center",
                                                }}
                                                // disabled={!!updatingProductId}
                                                value={quantity}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    const value = Number(
                                                        e.target.value
                                                    );
                                                    if (value === 0) return;
                                                    updateQuantity(value);
                                                }}
                                            />
                                        </Box>
                                        <Icon
                                            sx={{
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                updateQuantity(quantity + 1);
                                            }}
                                        >
                                            add
                                        </Icon>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Fade>
                </MDBox>

                <MDBox mt={2}>
                    <Grid item xs={12} lg={6} container>
                        <ActionButton
                            width={150}
                            disabled={quantity === 0 || loading}
                            loading={adding || updating}
                            text={"add to cart"}
                            // text={
                            //     productVariantUnavailable
                            //         ? "Unavailable"
                            //         : "add to cart"
                            // }
                            onClick={addToCart}
                        />
                    </Grid>
                </MDBox>
                <MDBox mt={4}>
                    {loading ? (
                        <Box>
                            <Skeleton
                                animation="pulse"
                                width="100%"
                                height={15}
                                variant="rectangular"
                            />
                            <Skeleton
                                animation="pulse"
                                width="100%"
                                height={15}
                                style={{ marginTop: 2 }}
                                variant="rectangular"
                            />
                            <Skeleton
                                animation="pulse"
                                width="100%"
                                height={15}
                                style={{ marginTop: 2 }}
                                variant="rectangular"
                            />
                            <Skeleton
                                animation="pulse"
                                width="100%"
                                height={15}
                                style={{ marginTop: 2 }}
                                variant="rectangular"
                            />
                        </Box>
                    ) : (
                        <MDBox color="text" fontSize="1.25rem" lineHeight={1}>
                            <MDTypography
                                variant="body2"
                                color="text"
                                fontWeight="regular"
                                verticalAlign="middle"
                            >
                                {product?.description}
                            </MDTypography>
                        </MDBox>
                    )}
                </MDBox>
            </MDBox>
        </Fade>
    );
}

export default ProductInfo;
