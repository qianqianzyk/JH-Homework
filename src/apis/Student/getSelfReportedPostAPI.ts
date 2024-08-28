import { request } from "../axios";

const getSelfReportedPostAPI = (data:{
    user_id: number
}) => {
    return request("/api/student/report-post", {
        method: "GET",
        params: data,
    });
};

export default getSelfReportedPostAPI