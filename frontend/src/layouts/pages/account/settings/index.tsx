import Grid from "@mui/material/Grid";
import MDBox from "src/components/MDBox";
import Sidenav from "src/layouts/pages/account/settings/components/Sidenav";
import BasicInfo from "src/layouts/pages/account/settings/components/BasicInfo";
import ChangePassword from "src/layouts/pages/account/settings/components/ChangePassword";
import Authentication from "src/layouts/pages/account/settings/components/Authentication";
import Notifications from "src/layouts/pages/account/settings/components/Notifications";
import Sessions from "src/layouts/pages/account/settings/components/Sessions";
import DeleteAccount from "src/layouts/pages/account/settings/components/DeleteAccount";

function Settings(): JSX.Element {
    return (
        <MDBox mt={4}>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={3}>
                    <Sidenav />
                </Grid>
                <Grid item xs={12} lg={9}>
                    <MDBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <BasicInfo />
                            </Grid>
                            <Grid item xs={12}>
                                <ChangePassword />
                            </Grid>
                            <Grid item xs={12}>
                                <Authentication />
                            </Grid>
                            <Grid item xs={12}>
                                <Notifications />
                            </Grid>
                            <Grid item xs={12}>
                                <Sessions />
                            </Grid>
                            <Grid item xs={12}>
                                <DeleteAccount />
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>
            </Grid>
        </MDBox>
    );
}

export default Settings;
