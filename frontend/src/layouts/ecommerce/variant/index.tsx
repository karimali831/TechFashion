import { Box, Chip } from "@mui/material";
import { IProductAttribute } from "src/interface/IProductAttribute";

interface IProps {
    selected: string;
    variant: IProductAttribute;
    onClick: (variant: string) => void;
}

export const Variant = ({ variant, selected, onClick }: IProps) => {
    return (
        <Box mt={2}>
            <span>{variant.attribute}</span>
            <Box display="flex" flexWrap="wrap" mt={1}>
                {variant.options.map((v) => {
                    return (
                        <Box mr={1} mb={1} key={v}>
                            <Chip
                                size="medium"
                                variant={selected === v ? "filled" : "outlined"}
                                label={v}
                                onClick={() => onClick(v)}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
