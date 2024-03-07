import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import MDInput from "src/components/MDInput";

// types
interface Props {
    width?: number;
    input?: {
        [key: string]: any;
    };
    [key: string]: any;
}

function MDDatePicker({ input, width, ...rest }: Props): JSX.Element {
    return (
        <Flatpickr
            {...rest}
            render={({ defaultValue }: any, ref: any) => (
                <MDInput
                    {...input}
                    variant="standard"
                    defaultValue={defaultValue}
                    inputRef={ref}
                    style={{ width: width ?? 300 }}
                    {...rest}
                />
            )}
        />
    );
}

MDDatePicker.defaultProps = {
    input: {},
};

export default MDDatePicker;
