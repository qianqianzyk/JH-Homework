import { request } from "../axios";

const delPostAPI = (data: {
    user_id: number,
    post_id: number
}) => {
    return request("/api/student/post", {
        params: data,
        method: "DELETE",
    });
};

export default delPostAPI