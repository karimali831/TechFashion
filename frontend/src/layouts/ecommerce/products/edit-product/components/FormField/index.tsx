/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 PRO React TS components
import MDInput from "src/components/MDInput";
import MDBox from "src/components/MDBox";

// Declaring props types for FormField
interface Props {
    label: string;
    [key: string]: any;
}

function FormField({ label, ...rest }: Props): JSX.Element {
    return (
        <MDBox mb={2}>
            <MDInput {...rest} variant="standard" label={label} fullWidth />
        </MDBox>
    );
}

export default FormField;
