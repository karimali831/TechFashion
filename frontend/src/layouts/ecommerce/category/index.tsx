import { type NavigateFunction, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import Search from "../search";

export interface Categories {
    name: string;
    categoryLink: string;
    id: any;
}

const categories: Categories[] = [
    {
        name: "accessories",
        categoryLink: "/store/category/accessories",
        id: 1,
    },
    {
        name: "outdoor",
        categoryLink: "/store/category/outdoor",
        id: 2,
    },
    {
        name: "mens",
        categoryLink: "/store/category/mens",
        id: 3,
    },
    {
        name: "footware",
        categoryLink: "/store/category/footware",
        id: 4,
    },
    {
        name: "womans",
        categoryLink: "/store/category/womans",
        id: 5,
    },
    {
        name: "outware",
        categoryLink: "/store/category/outware",
        id: 6,
    },
    {
        name: "jewelry",
        categoryLink: "/store/category/jewelry",
        id: 7,
    },
    {
        name: "sportsware",
        categoryLink: "/store/category/sportsware",
        id: 8,
    },
];
const Category = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();
    return (
        <div className="category">
            <div className="category-links">
                {categories.map((category: Categories) => {
                    return (
                        <p
                            key={category.id}
                            onClick={() => {
                                navigate(category.categoryLink);
                            }}
                        >
                            {category.name}
                        </p>
                    );
                })}
            </div>
            <Search />
        </div>
    );
};

export default Category;
