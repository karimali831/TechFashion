import { ReactNode } from "react";

export interface IChart {
    labels: IChartLabel[];
    datasets: IChartDataset[];
}

export interface IChartLabel {
    id: number;
    tagId?: string;
    name: string;
    cat1Name?: string;
    superName?: string;
    subId?: number;
    superId?: number;
    isFinance?: boolean;
}

type ChartColor =
    | "info"
    | "primary"
    | "dark"
    | "secondary"
    | "primary"
    | "warning"
    | "success"
    | "error";

export interface IChartDataset {
    label: string;
    data: string[] | number[];
    backgroundColors?: ChartColor[];
}

export interface IAvatar {
    imageSrc: string;
    name: string;
}

export interface IDataTable {
    columns: IDataTableColumn[];
    rows: IDataTableRow[];
}

export interface IDataTableColumn {
    Header: string;
    accessor: string; // the key for rows referencing same as header?
    width: string; // 10%
    align: string; // left, center
}

export interface IDataTableRow {
    [accessor: string]: string | ReactNode | number;
}
