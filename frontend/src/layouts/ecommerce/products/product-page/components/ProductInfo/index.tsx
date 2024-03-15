import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { useState } from "react";
import {
    useAddProductToCartMutation,
    useGetCartQuery,
    useUpdateProductQuantityMutation,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDBadge from "src/components/MDBadge";
import MDBox from "src/components/MDBox";
import MDInput from "src/components/MDInput";
import MDTypography from "src/components/MDTypography";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { IProductDetail } from "src/interface/IProductDetail";
import { IProductVariantObj } from "src/interface/IProductVariantObj";
import { useAppDispatch } from "src/state/Hooks";
import { OpenCartOverlayAction } from "src/state/contexts/cart/Actions";

interface IProps {
    item: IProductDetail[];
}

function ProductInfo({ item }: IProps): JSX.Element {
    const [quantity, setQuantity] = useState<number>(1);
    const [variations, setVariations] = useState<IProductVariantObj[]>([]);

    const [addProductToCart, { isLoading: adding }] =
        useAddProductToCartMutation();
    const [updateProductQuantity] = useUpdateProductQuantityMutation();

    const { data: cart } = useGetCartQuery();

    const { data: products } = useGetProductQuery();

    const dispatch = useAppDispatch();

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const itemInCart = itemsInCart.filter((x) =>
        item.some(
            (i) =>
                i.id === x.productId &&
                (!i.productVariantId ||
                    i.productVariantId === x.productVariantId)
        )
    )[0];

    const itemVariantInCart =
        itemInCart &&
        itemInCart.variationsList.filter((x) =>
            variations.some(
                (y) => y.attribute === x.attribute && y.value === x.value
            )
        );

    // console.log("p1", itemInCart?.variationsList);
    // console.log(
    //     "p2",
    //     products.variants.filter((x) => x.productId === item[0].id)
    // );
    console.log("itemVariantInCart: ", itemVariantInCart);
    console.log("itemInCart", itemInCart);

    const addToCart = async () => {
        if (itemVariantInCart) {
            const totalQuantity = itemInCart.quantity + quantity;

            await updateProductQuantity({
                id: itemInCart.id,
                quantity: totalQuantity,
            })
                .unwrap()
                .then((payload) => {})
                .catch((error) => {
                    console.error(error);
                });
        } else {
            await addProductToCart({
                cartId: 1,
                quantity,
                productId: item[0].id,
                productVariantId: itemInCart.productVariantId,
            })
                .unwrap()
                .then((payload) => {})
                .catch((error) => {
                    console.error(error);
                });
        }

        dispatch(OpenCartOverlayAction(true));
        setQuantity(1);
    };

    const updateVariant = (key: string, value: string) => {
        const exists = variations.filter((x) => x.attribute === key)[0];

        if (exists) {
            setVariations(
                variations.map((v) =>
                    v.attribute === key ? { ...v, value } : v
                )
            );
        } else {
            const newState = [...variations, { attribute: key, value }];
            setVariations(newState);
        }
    };

    return (
        <MDBox>
            <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                    {item[0].title}
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
                    {item[0].price}
                </MDTypography>
            </MDBox>
            <MDBadge
                variant="contained"
                color="success"
                badgeContent="in stock"
                container
            />
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
                <MDBox
                    component="li"
                    color="text"
                    fontSize="1.25rem"
                    lineHeight={1}
                >
                    <MDTypography
                        variant="body2"
                        color="text"
                        fontWeight="regular"
                        verticalAlign="middle"
                    >
                        The most beautiful curves of this swivel stool adds an
                        elegant touch to any environment
                    </MDTypography>
                </MDBox>
                <MDBox
                    component="li"
                    color="text"
                    fontSize="1.25rem"
                    lineHeight={1}
                >
                    <MDTypography
                        variant="body2"
                        color="text"
                        fontWeight="regular"
                        verticalAlign="middle"
                    >
                        Memory swivel seat returns to original seat position
                    </MDTypography>
                </MDBox>
                <MDBox
                    component="li"
                    color="text"
                    fontSize="1.25rem"
                    lineHeight={1}
                >
                    <MDTypography
                        variant="body2"
                        color="text"
                        fontWeight="regular"
                        verticalAlign="middle"
                    >
                        Comfortable integrated layered chair seat cushion design
                    </MDTypography>
                </MDBox>
                <MDBox
                    component="li"
                    color="text"
                    fontSize="1.25rem"
                    lineHeight={1}
                >
                    <MDTypography
                        variant="body2"
                        color="text"
                        fontWeight="regular"
                        verticalAlign="middle"
                    >
                        Fully assembled! No assembly required
                    </MDTypography>
                </MDBox>
            </MDBox>
            <MDBox mt={3}>
                <Grid container spacing={3}>
                    {products.variants
                        .filter((x) => x.productId === item[0].id)
                        .map((variant, idx) => {
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
                                        value={
                                            selectedVariant ??
                                            variant.options[0]
                                        }
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
                                min: 1,
                                max: 10,
                                style: { width: 150 },
                                onChange: (
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setQuantity(Number(e.target.value)),
                            }}
                            value={quantity}
                            variant="standard"
                        />
                    </Grid>
                </Grid>
            </MDBox>
            <MDBox mt={3}>
                <Grid item xs={12} lg={5} container>
                    <ActionButton
                        disabled={quantity === 0}
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
