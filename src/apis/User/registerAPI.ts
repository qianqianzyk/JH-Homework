import { request } from "../axios";
import {registerInfo} from "@/types/userInfo.ts";
const registerAPI = (data: registerInfo) => {
    return request("/api/user/reg", {
        data: data,
        method: "POST",
    });
};
export default registerAPI;