export interface IStepper {
    id: number;
    label: string;
    disabled?: boolean;
    errorMsg?: Readonly<string>;
    showErrorMsg?: boolean;
}
