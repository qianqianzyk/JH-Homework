import { request } from "../axios";

const dealReportedPostAPI = (data: {
    approval: number,
    user_id: number,
    post_id: number,
}) => {
    return request("/api/admin/report", {
        data: data,
        method: "POST",
    });
};

export default dealReportedPostAPI