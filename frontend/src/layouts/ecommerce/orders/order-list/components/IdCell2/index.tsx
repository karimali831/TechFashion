import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import "./styles.css";

// Declaring props types for IdCell
interface Props {
    id: string;
    onClick?: () => void;
}

function IdCell2({ id, onClick }: Props): JSX.Element {
    return (
        <MDBox ml={1} className="id" onClick={onClick}>
            <MDTypography variant="caption" color="text">
                {id}
            </MDTypography>
        </MDBox>
    );
}

// Declaring default props for IdCell
IdCell2.defaultProps = {};

export default IdCell2;
