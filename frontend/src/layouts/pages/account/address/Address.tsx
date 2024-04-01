import { Typography, Box, Slide, CircularProgress } from "@mui/material";
import { useRef, useState } from "react";

import MDButton from "src/components/MDButton";
import { ICustomerAddress } from "src/data/ICustomerAddress";
import { EditAddress } from "./Edit";
import { useDeleteAddressMutation } from "src/api/userApi";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import Swal from "sweetalert2";

type EditAddressProps = {
    address: ICustomerAddress;
};

export const Address = ({ address }: EditAddressProps) => {
    const topElement = useRef<HTMLInputElement | null>(null);
    const [editAddress, setEditAddress] = useState<boolean>(false);

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();

    useEffectSkipInitialRender(() => {
        if (deletingId) {
            onDeleteAddress();
        }
    }, [deletingId]);

    const onDeleteAddress = async () => {
        await deleteAddress(deletingId)
            .unwrap()
            .then((payload) => {
                if (payload) {
                    Swal.fire({
                        icon: "success",
                        title: "Address deleted",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setDeletingId(null);
            });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems={"center"}>
            {!editAddress && (
                <>
                    {address.main && (
                        <Box mb={2}>
                            <h2>Default</h2>
                        </Box>
                    )}
                    <Typography className="standard-text">
                        {address.name}
                    </Typography>
                    <Typography className="standard-text">
                        {address.line1}
                    </Typography>
                    <Typography className="standard-text">
                        {address.line2}
                    </Typography>
                    <Typography className="standard-text">
                        {address.city}
                    </Typography>
                    <Typography className="standard-text">
                        {address.postalCode}
                    </Typography>
                    <Typography className="standard-text">
                        {address.country}
                    </Typography>
                    <Box mt={2} display="flex" alignItems="center">
                        <Box mr={1} ref={topElement}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                onClick={() => setEditAddress(!editAddress)}
                            >
                                Edit
                            </MDButton>
                        </Box>
                        {!address.main && (
                            <MDButton
                                variant="outlined"
                                color="info"
                                onClick={() => setDeletingId(address.id)}
                                startIcon={
                                    deleting && <CircularProgress size={16} />
                                }
                                disabled={!!editAddress}
                            >
                                Delete
                            </MDButton>
                        )}
                    </Box>
                </>
            )}
            <Box
                sx={{
                    margin: "30px auto",
                    borderRadius: 2,
                    boxShadow: "0 0 0 0.1rem rgba(18, 18, 18, 0.1)",
                    overflow: "auto",
                }}
            >
                <Slide
                    in={editAddress}
                    direction="down"
                    mountOnEnter={true}
                    unmountOnExit={true}
                    container={topElement.current}
                >
                    <Box p={3}>
                        <h2>Edit address</h2>
                        <EditAddress
                            address={address}
                            onCancel={() => setEditAddress(false)}
                        />
                    </Box>
                </Slide>
            </Box>
        </Box>
    );
};
