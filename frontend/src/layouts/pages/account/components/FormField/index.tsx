import MDInput from "src/components/MDInput";

// Declaring props types for FormField
interface Props {
    label?: string;
    width?: number;
    [key: string]: any;
}

function FormField({ label, width, ...rest }: Props): JSX.Element {
    return (
        <MDInput
            variant="standard"
            label={label}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ width: width ?? 300 }}
            {...rest}
        />
    );
}

// Declaring default props for FormField
FormField.defaultProps = {
    label: " ",
};

export default FormField;
