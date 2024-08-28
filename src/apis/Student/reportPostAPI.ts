import { request } from "../axios";

const reportPostAPI = (data: {
    post_id: number,
    user_id: number,
    reason: string
}) => {
    return request("/api/student/report-post", {
        data: data,
        method: "POST",
    });
};

export default reportPostAPI