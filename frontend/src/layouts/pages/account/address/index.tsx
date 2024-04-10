import { Box, Fade, LinearProgress, Slide } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDBox from "src/components/MDBox";
import { Page } from "src/enum/Page";
import { useAppSelector } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import { EditAddress } from "./Edit";
import { Address } from "./Address";
import { useAccountDetailsQuery } from "src/api/userApi";

export const Addresses = () => {
    const topElement = useRef<HTMLInputElement | null>(null);
    const [newAddress, setNewAddress] = useState<boolean>(false);

    const { user } = useAppSelector(getUserState);

    const { data: account, isLoading: accountLoading } = useAccountDetailsQuery(
        user.id
    );

    const dispatch = useDispatch();

    if (accountLoading) {
        return <LinearProgress />;
    }

    const defaultAddress = account.addresses.filter((x) => x.main)[0];

    return (
        <MDBox mt={4} className="content" display="flex" flexDirection="column">
            <Fade
                in={true}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
                ref={topElement}
            >
                <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <h1>Addresses</h1>
                    <Box mb={4} mt={4}>
                        <span
                            className="standard-text link"
                            onClick={() =>
                                dispatch(ShowPageAction(Page.Account))
                            }
                        >
                            Return to Account details
                        </span>
                    </Box>
                    {!newAddress && (
                        <ActionButton
                            text="Add new address"
                            width={200}
                            onClick={() => setNewAddress(!newAddress)}
                        />
                    )}
                </MDBox>
            </Fade>

            <Box
                sx={{
                    margin: "30px auto",
                    borderRadius: 2,
                    boxShadow: "0 0 0 0.1rem rgba(18, 18, 18, 0.1)",
                    overflow: "auto",
                }}
            >
                <Slide
                    in={newAddress}
                    direction="down"
                    mountOnEnter={true}
                    unmountOnExit={true}
                    container={topElement.current}
                >
                    <Box p={3}>
                        <h2>New address</h2>
                        <EditAddress onCancel={() => setNewAddress(false)} />
                    </Box>
                </Slide>
            </Box>
            <Fade
                in={!!defaultAddress}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
                style={{ transitionDelay: "100ms" }}
            >
                <Box>
                    <Address
                        address={defaultAddress}
                        count={account.addresses.length}
                    />
                </Box>
            </Fade>
            {account.addresses
                .filter((x) => !x.main)
                .map((address, idx) => {
                    return (
                        <Fade
                            key={idx}
                            in={true}
                            mountOnEnter={true}
                            unmountOnExit={true}
                            timeout={500}
                            style={{
                                transitionDelay: (idx + 2) * 100 + "ms",
                            }}
                        >
                            <Box mt={4}>
                                <Address
                                    address={address}
                                    count={account.addresses.length}
                                />
                            </Box>
                        </Fade>
                    );
                })}
        </MDBox>
    );
};
