import { CategoryType } from "src/enum/CategoryType";

export interface ICategory {
    id: number;
    name: string;
    typeId: CategoryType;
    secondTypeId?: CategoryType;
    disabled: boolean;
    superCatId?: number;
    private: boolean;
    // unmapped from entity
    superCategory: string;
    monzoTag: string;
    subs?: ICategory[];
}
