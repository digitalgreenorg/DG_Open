import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";

export const handleDeleteFile = async (bodyFormData) => {
    HTTPService(
        "DELETE",
        UrlConstant.base_url + UrlConstant.dataseteth,
        bodyFormData,
        true,
        true
    )
        .then((response) => {
            return true
        })
        .catch((e) => {
            return false
        }
        );
}