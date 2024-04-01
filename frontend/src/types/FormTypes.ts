export interface IForm<T extends string> {
    formId: string;
    formField: Record<T, IFormField<T>>;
}

export interface IFormField<T> {
    name: T;
    label: string;
    placeholder?: string;
    type: "text" | "number" | "checkbox";
    errorMsg?: string;
    invalidMsg?: string;
}

export type FormValueType = string | Date | number;

export type FormValue<T extends string> = Record<T, FormValueType>;

export interface FormikActions<Values> {
    setFieldValue<Field extends keyof Values>(
        field: Field,
        value: Values[Field],
        shouldValidate?: boolean
    ): void;
}

declare module formik {
    export interface FormikHelpers<Values> {
        setFieldValueTS<Field extends keyof Values>(
            field: Field,
            value: Values[Field],
            shouldValidate?: boolean
        ): void;
    }
}
