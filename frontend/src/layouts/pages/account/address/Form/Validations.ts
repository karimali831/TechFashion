import * as Yup from "yup";
import form from ".";
const {
    formField: { name, line1, line2, city, postalCode },
} = form;

const validations = [
    Yup.object().shape({
        [name.name]: Yup.string().required(name.errorMsg),
        [line1.name]: Yup.string().required(line1.errorMsg),
        [line2.name]: Yup.string(),
        [city.name]: Yup.string(),
        [postalCode.name]: Yup.string().required(postalCode.errorMsg),
    }),
];

export default validations;
