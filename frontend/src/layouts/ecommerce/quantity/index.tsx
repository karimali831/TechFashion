import { Box, Icon } from "@mui/material";
import { useState } from "react";
import { useUpdateProductQuantityMutation } from "src/api/cartApi";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { UpdatingProductIdAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";

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
        quantity: number,
        stock?: number
    ) => {
        if (updatingProductQuantity || quantity === 0) return;

        if (quantity) {
            dispatch(UpdatingProductIdAction(id));
        }
        await updateProductQuantity({
            id,
            quantity,
        })
            .unwrap()
            .then((payload) => {})
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

                        const quantity = item.quantity - 1;

                        if (item.stock && quantity > item.stock) {
                            return;
                        }
                        setQuantity({
                            id: item.id,
                            quantity,
                        });
                        onQuantityChange(item.id, quantity, item.stock);
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

                            onQuantityChange(
                                item.id,
                                Number(e.target.value),
                                item.stock
                            );
                        }}
                    />
                    {item.stock && (
                        <span
                            style={{
                                position: "relative",
                                right: "25%",
                            }}
                        >
                            {"/ " + item.stock}
                        </span>
                    )}
                </Box>
                <Icon
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        const quantity = item.quantity + 1;

                        if (item.stock && quantity > item.stock) {
                            return;
                        }

                        setQuantity({
                            id: item.id,
                            quantity,
                        });
                        onQuantityChange(item.id, quantity, item.stock);
                    }}
                >
                    add
                </Icon>
            </Box>
        </Box>
    );
};
