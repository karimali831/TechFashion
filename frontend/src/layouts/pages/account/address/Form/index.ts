import { IForm } from "src/types/FormTypes";

export type FormFieldName = "name" | "line1" | "line2" | "city" | "postalCode";

const form: IForm<FormFieldName> = {
    formId: "edit-address",
    formField: {
        name: {
            name: "name",
            label: "Full name",
            type: "text",
            errorMsg: "Full name is required",
        },
        line1: {
            name: "line1",
            label: "Address 1",
            type: "text",
            errorMsg: "Address line 1 is required",
        },
        line2: {
            name: "line2",
            label: "Address 2",
            type: "text",
        },
        city: {
            name: "city",
            label: "City",
            type: "text",
        },
        postalCode: {
            name: "postalCode",
            label: "Postal/ZIP code",
            type: "text",
            errorMsg: "Postal/ZIP code is required",
        },
    },
};

export default form;
