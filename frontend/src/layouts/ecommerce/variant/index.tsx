import { Box, Chip, Stack } from "@mui/material";
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
            <Stack direction="row" spacing={1} mb={1} mt={1}>
                {variant.options.map((v) => {
                    return (
                        <Chip
                            key={v}
                            size="medium"
                            variant={selected === v ? "filled" : "outlined"}
                            label={v}
                            onClick={() => onClick(v)}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};
