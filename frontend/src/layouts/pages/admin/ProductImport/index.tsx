import axios from "axios";
import { useState } from "react";
import { baseApiUrl } from "src/api/baseApi";
import MDBox from "src/components/MDBox";

export const ProductImport = () => {
    const [csvFile, setCsvFile] = useState<Blob | null>(null);

    const formData = new FormData();

    if (csvFile) {
        formData.append("path_to_csv", csvFile);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) setCsvFile(e.currentTarget.files[0]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        async function fetchData() {
            const res: any = await axios.post(
                baseApiUrl + "ProductImport/Upload",
                formData
            );
            console.log(res.data);
        }
        fetchData();
    };

    return (
        <MDBox className="home">
            <h1>Import Ebay Prodocts</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".csv" onChange={handleChange} />
                <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded-md font-semibold"
                >
                    fetch
                </button>
            </form>
        </MDBox>
    );
};
