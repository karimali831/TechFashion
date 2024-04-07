import { Box, Icon } from "@mui/material";
import { useState } from "react";
import { useUpdateProductQuantityMutation } from "src/api/cartApi";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { UpdatingProductIdAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { SetStockAction } from "src/state/contexts/product/Actions";
import Swal from "sweetalert2";

interface IProps {
    item: ICartProductDetail;
}

interface IProductCartQuantity {
    id: number;
    quantity: number;
}

export const ProductQuantity = ({ item }: IProps) => {
    const [quantity, setQuantity] = useState<IProductCartQuantity | null>(null);

    const [updateProductQuantity, { isLoading: updatingProductQuantity }] =
        useUpdateProductQuantityMutation();

    const { updatingProductId } = useAppSelector(getCartState);

    const dispatch = useAppDispatch();

    const onQuantityChange = async (
        id: number,
        value: number,
        replinish: boolean
    ) => {
        if (updatingProductQuantity || value === 0) return;

        if (value) {
            dispatch(UpdatingProductIdAction(id));
        }

        await updateProductQuantity({
            id,
            quantity: value,
            replinish,
        })
            .unwrap()
            .then((payload) => {
                if (payload.errorMsg) {
                    Swal.fire({
                        icon: "error",
                        title: payload.errorMsg,
                    });
                    setQuantity({
                        id,
                        quantity: item.quantity,
                    });
                    dispatch(SetStockAction(0));
                } else {
                    setQuantity({
                        id,
                        quantity: value,
                    });
                    const stock = payload.data === 0 ? null : payload.data;
                    dispatch(SetStockAction(stock));
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => dispatch(UpdatingProductIdAction(null)));
    };

    return (
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
                        color: item.quantity === 1 ? "#333" : "#000",
                        cursor: item.quantity !== 1 && "pointer",
                    }}
                    onClick={() => {
                        if (item.quantity == 1) return;

                        const value =
                            quantity?.id === item.id
                                ? quantity.quantity
                                : item.quantity;

                        onQuantityChange(item.id, value - 1, true);
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
                        disabled={!!updatingProductId}
                        value={
                            quantity?.id === item.id
                                ? quantity.quantity
                                : item.quantity
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            if (value === 0) return;

                            setQuantity({
                                id: item.id,
                                quantity: value,
                            });
                        }}
                        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            if (value === 0) return;

                            const replinish = value < item.quantity;
                            onQuantityChange(item.id, value, replinish);
                        }}
                    />
                    {/* {item.stock && (
                        <span
                            style={{
                                position: "relative",
                                right: "25%",
                            }}
                        >
                            {"/ " + item.stock}
                        </span>
                    )} */}
                </Box>
                <Icon
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        // const quantity = item.quantity + 1;

                        const value =
                            quantity?.id === item.id
                                ? quantity.quantity
                                : item.quantity;

                        onQuantityChange(item.id, value + 1, false);
                    }}
                >
                    add
                </Icon>
            </Box>
        </Box>
    );
};
