import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import MDBadge from "src/components/MDBadge";
import MDInput from "src/components/MDInput";
import { ActionButton } from "src/components/Buttons/ActionButton";
import { IProductInfo } from "src/interface/IProductInfo";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import {
    AddToCartAction,
    OpenCartOverlayAction,
    UpdateProductCartQuantityAction,
} from "src/state/contexts/cart/Actions";
import { uuidv4 } from "@firebase/util";
import { useState } from "react";
import { getCartState } from "src/state/contexts/cart/Selectors";

interface IProps {
    item: IProductInfo;
}

function ProductInfo({ item }: IProps): JSX.Element {
    const [adding, setAdding] = useState<boolean>(false);
    const [variant, setVariant] = useState<any>({
        material: "Steel",
        color: "White",
    });
    const [quantity, setQuantity] = useState<number>(1);

    const { itemsInCart } = useAppSelector(getCartState);
    const dispatch = useAppDispatch();

    const itemInCart = itemsInCart.filter(
        (x) =>
            x.productId === item.id &&
            JSON.stringify(variant) === JSON.stringify(x.variant)
    )[0];

    const addToCart = () => {
        setAdding(true);

        setTimeout(() => {
            if (!!itemInCart) {
                const totalQuantity = itemInCart.quantity + quantity;

                dispatch(
                    UpdateProductCartQuantityAction({
                        id: itemInCart.id,
                        price: "£" + item.price * totalQuantity,
                        quantity: totalQuantity,
                    })
                );
            } else {
                dispatch(
                    AddToCartAction({
                        id: uuidv4(),
                        productId: item.id,
                        variant,
                        quantity,
                        price: "£" + item.price * quantity,
                    })
                );
            }

            dispatch(OpenCartOverlayAction(true));
            setQuantity(1);
            setAdding(false);
        }, 1000);
    };

    const updateVariant = (key: string, value: string) => {
        setVariant({
            ...variant,
            [key]: value,
        });
    };

    return (
        <MDBox>
            <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                    {item.name}
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
                    {item.priceStr}
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
                    <Grid item xs={12} lg={5}>
                        <MDBox mb={1.5} lineHeight={0} display="inline-block">
                            <MDTypography
                                component="label"
                                variant="button"
                                color="text"
                                fontWeight="regular"
                            >
                                Frame Material
                            </MDTypography>
                        </MDBox>
                        <Autocomplete
                            value={variant["material"]}
                            options={["Aluminium", "Carbon", "Steel", "Wood"]}
                            onChange={(
                                e: React.SyntheticEvent,
                                value: string
                            ) => updateVariant("material", value)}
                            renderInput={(params) => (
                                <MDInput {...params} variant="standard" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <MDBox mb={1.5} lineHeight={0} display="inline-block">
                            <MDTypography
                                component="label"
                                variant="button"
                                color="text"
                                fontWeight="regular"
                            >
                                Color
                            </MDTypography>
                        </MDBox>
                        <Autocomplete
                            value={variant["color"]}
                            options={[
                                "Black",
                                "Blue",
                                "Grey",
                                "Pink",
                                "Red",
                                "White",
                            ]}
                            onChange={(
                                e: React.SyntheticEvent,
                                value: string
                            ) => updateVariant("color", value)}
                            renderInput={(params) => (
                                <MDInput {...params} variant="standard" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <MDBox mb={1.5} lineHeight={0} width={200}>
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
                            width={250}
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
