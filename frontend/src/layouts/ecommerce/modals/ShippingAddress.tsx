import {
    CircularProgress,
    FormControl,
    Select,
    SelectChangeEvent,
    MenuItem,
} from "@mui/material";
import { useAccountDetailsQuery } from "src/api/userApi";
import MDBox from "src/components/MDBox";
import { MDModal } from "src/components/MDModal";
import MDTypography from "src/components/MDTypography";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import {
    SetAddressIdAction,
    OpenSelectAddressModalAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { getUserState } from "src/state/contexts/user/Selectors";

export const ShippingAddressModal = () => {
    const { openSelectAddressModal, addressId } = useAppSelector(getCartState);

    const { user } = useAppSelector(getUserState);

    const { data: account, isLoading: accountLoading } = useAccountDetailsQuery(
        user?.id,
        { skip: !user }
    );

    const dispatch = useAppDispatch();

    return (
        <MDModal
            title="Saved shipping addresses"
            open={openSelectAddressModal}
            content={
                <MDBox mt={4}>
                    <MDBox mb={1.5} lineHeight={0} display="inline-block">
                        <MDTypography
                            component="label"
                            variant="button"
                            color="text"
                            fontWeight="regular"
                        >
                            Select address
                        </MDTypography>
                    </MDBox>
                    {accountLoading ? (
                        <CircularProgress size={16} />
                    ) : (
                        <FormControl
                            fullWidth={true}
                            variant="filled"
                            size="medium"
                        >
                            <Select
                                labelId="saved-addresses"
                                value={addressId?.toString()}
                                variant="standard"
                                label="Address"
                                onChange={(event: SelectChangeEvent) => {
                                    dispatch(
                                        SetAddressIdAction(
                                            Number(event.target.value)
                                        )
                                    );
                                    dispatch(
                                        OpenSelectAddressModalAction(false)
                                    );
                                }}
                            >
                                {account?.addresses.map((address, idx) => (
                                    <MenuItem key={idx} value={address.id}>
                                        {address.line1} {address.city}{" "}
                                        {address.postalCode} {address.country} (
                                        {address.name})
                                    </MenuItem>
                                ))}
                                <MenuItem value={0}>
                                    Enter new address in checkout
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </MDBox>
            }
            onClose={() => dispatch(OpenSelectAddressModalAction(false))}
        />
    );
};
