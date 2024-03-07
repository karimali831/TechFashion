import { SideNavColor } from "src/state/contexts/dashboard/IDashboardState";

export function getProgressBarColor(
    value: number,
    targetValue: number,
    reverse: boolean,
    currentPeriod: boolean
): {
    color: SideNavColor;
    progressValue: number;
} {
    let color: SideNavColor = "info";

    let progressValue = Math.round((100 / targetValue) * value);

    if (progressValue > 100) progressValue = 100;

    if (progressValue < 0) progressValue = 0;

    if (!currentPeriod) {
        if (progressValue == 100) {
            color = reverse ? "error" : "success";
        } else {
            color = reverse ? "success" : "error";
        }
    } else {
        if (progressValue > 0 && progressValue < 10) {
            color = reverse ? "success" : "error";
        } else if (progressValue >= 10 && progressValue < 30) {
            color = reverse ? "info" : "warning";
        } else if (progressValue >= 30 && progressValue < 70) {
            color = "info";
        } else if (progressValue >= 70 && progressValue < 99) {
            color = reverse ? "warning" : "info";
        } else if (progressValue == 100) {
            color = reverse ? "error" : "success";
        }
    }

    return { color, progressValue };
}
