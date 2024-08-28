import { request } from "../axios";

const getReportedPostAPI = (data:{
    user_id: number
}) => {
    return request("/api/admin/report", {
        method: "GET",
        params: data,
    });
};

export default getReportedPostAPI