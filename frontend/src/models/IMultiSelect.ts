import { MultiSelectId } from "../enum/MultiSelectId"

export interface IMultiSelectWrapper {
    id: MultiSelectId
    name: string
    children: IMultiSelect[]
}

export interface IMultiSelect {
    id: string
    name: string
    default?: boolean
}