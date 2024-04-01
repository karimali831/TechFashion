import { Box, Checkbox, CircularProgress } from "@mui/material";
import { Form, Formik } from "formik";
import ReactFlagsSelect from "react-flags-select";
import { ActionButton } from "src/components/Buttons/ActionButton";
import MDBox from "src/components/MDBox";
import MDButton from "src/components/MDButton";
import MDTypography from "src/components/MDTypography";
import { FormValue } from "src/types/FormTypes";
import FormField from "../components/FormField";
import form, { FormFieldName } from "./Form";
import validations from "./Form/Validations";
import { useAddOrUpdateAddressMutation } from "src/api/userApi";
import { useRef, useState } from "react";
import { useAppSelector } from "src/state/Hooks";
import { getUserState } from "src/state/contexts/user/Selectors";
import { ICustomerAddress } from "src/data/ICustomerAddress";
import Swal from "sweetalert2";

interface IProps {
    address?: ICustomerAddress;
    onCancel: () => void;
}

export const EditAddress = ({ address, onCancel }: IProps) => {
    const formikRef = useRef(null);

    const [selectedCountry, setSelectedCountry] = useState<string>("GB");
    const [mainAddress, setMainAddress] = useState<boolean>(
        address?.main ?? false
    );

    const [updateAddress, { isLoading: updating }] =
        useAddOrUpdateAddressMutation();

    const { user } = useAppSelector(getUserState);

    const { formId, formField } = form;
    const currentValidation = validations[0];

    const initialValues: FormValue<FormFieldName> = {
        name: address?.name ?? "",
        line1: address?.line1 ?? "",
        line2: address?.line2 ?? "",
        city: address?.city ?? "",
        postalCode: address?.postalCode ?? "",
    };

    const handleSubmit = async (
        values: FormValue<FormFieldName>,
        actions: any
    ) => {
        await updateAddress({
            id: address?.id ?? 0,
            userId: user.id,
            name: values.name as string,
            line1: values.line1 as string,
            line2: values.line2 as string,
            city: values.city as string,
            postalCode: values.postalCode as string,
            main: mainAddress,
            country: selectedCountry,
        })
            .unwrap()
            .then((payload) => {
                if (payload.errorMsg) {
                    Swal.fire({
                        icon: "error",
                        title: payload.errorMsg,
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Address " + (address ? "updated" : "created"),
                    });
                }
                onCancel();
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                actions.setSubmitting(false);
                actions.resetForm();
            });
    };

    return (
        <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={currentValidation}
            onSubmit={handleSubmit}
        >
            {({
                values,
                errors,
                touched,
                isSubmitting,
                handleChange,
                setFieldValue,
            }) => {
                const { name, line1, line2, city, postalCode } = formField;

                const {
                    name: nameV,
                    line1: line1V,
                    line2: line2V,
                    city: cityV,
                    postalCode: postalCodeV,
                } = values as FormValue<FormFieldName>;

                return (
                    <Form id={formId} autoComplete="on">
                        <MDBox mb={1}>
                            <FormField
                                type={name.type}
                                name={name.name}
                                value={nameV}
                                placeholder={name.label}
                                error={errors.name && touched.name}
                                success={nameV && !errors.name}
                                // label={name.label}
                                onChange={handleChange}
                            />
                        </MDBox>
                        <MDBox mb={1}>
                            <FormField
                                type={line1.type}
                                name={line1.name}
                                value={line1V}
                                placeholder={line1.label}
                                error={errors.name && touched.name}
                                success={line1V && !errors.name}
                                // label={name.label}
                                onChange={handleChange}
                            />
                        </MDBox>
                        <MDBox mb={1}>
                            <FormField
                                type={line2.type}
                                name={line2.name}
                                value={line2V}
                                placeholder={line2.label}
                                error={errors.name && touched.name}
                                success={line2V && !errors.name}
                                // label={name.label}
                                onChange={handleChange}
                            />
                        </MDBox>
                        <MDBox mb={1}>
                            <FormField
                                type={city.type}
                                name={city.name}
                                value={cityV}
                                placeholder={city.label}
                                error={errors.name && touched.name}
                                success={cityV && !errors.name}
                                // label={name.label}
                                onChange={handleChange}
                            />
                        </MDBox>
                        <MDBox mb={1}>
                            <FormField
                                type={postalCode.type}
                                name={postalCode.name}
                                value={postalCodeV}
                                placeholder={postalCode.label}
                                error={errors.name && touched.name}
                                success={postalCodeV && !errors.name}
                                // label={name.label}
                                onChange={handleChange}
                            />
                        </MDBox>
                        <Box width={300} mt={2}>
                            <ReactFlagsSelect
                                placeholder="Select country"
                                selectedSize={14}
                                optionsSize={14}
                                searchPlaceholder="Search countries"
                                fullWidth={true}
                                searchable={true}
                                selected={selectedCountry}
                                onSelect={(code) => setSelectedCountry(code)}
                            />
                        </Box>
                        {!address?.main && (
                            <MDBox
                                display="flex"
                                alignItems="center"
                                mt={1}
                                ml={-1}
                                onClick={() => setMainAddress(!mainAddress)}
                            >
                                <Checkbox checked={mainAddress} />
                                <MDTypography
                                    variant="button"
                                    fontWeight="regular"
                                    color="text"
                                    sx={{
                                        cursor: "pointer",
                                        userSelect: "none",
                                        ml: -1,
                                    }}
                                >
                                    &nbsp;&nbsp;Set as default address
                                </MDTypography>
                            </MDBox>
                        )}
                        <Box
                            mt={2}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <MDButton
                                variant="gradient"
                                color="info"
                                type="submit"
                                startIcon={
                                    (isSubmitting || updating) && (
                                        <CircularProgress size={16} />
                                    )
                                }
                                disabled={isSubmitting || updating}
                            >
                                {address ? "Update" : "Add Address"}
                            </MDButton>
                            <ActionButton
                                text="Cancel"
                                size="small"
                                outlined={true}
                                onClick={onCancel}
                            />
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
};
