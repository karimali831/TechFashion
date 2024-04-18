import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import {
    Step,
    StepConnector,
    stepConnectorClasses,
    styled,
} from "@mui/material";
// import "./styles.less";
import { IStepper } from "src/interface/IStepper";
import MDTypography from "../MDTypography";

interface IProps<T> {
    steps: IStepper[];
    activeStep: T;
    icons: React.ElementType;
    setActiveStep?: (step: number) => void;
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));

export const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
        backgroundImage:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
        backgroundImage:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
}));

export const ProgressStepper = <T extends number>({
    steps,
    icons,
    activeStep,
    setActiveStep,
}: IProps<T>) => {
    return (
        <Stepper
            sx={{
                background: "transparent",
                p: 0,
                m: 0,
                boxShadow: "none",
                width: "100%",
            }}
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}
        >
            {steps.map((step) => (
                <Step key={step.id}>
                    <StepLabel
                        StepIconComponent={icons}
                        onClick={
                            step.disabled
                                ? undefined
                                : () => setActiveStep && setActiveStep(step.id)
                        }
                    >
                        <MDTypography
                            variant="caption"
                            color="text"
                            fontSize="small"
                        >
                            {step.label}
                        </MDTypography>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};
