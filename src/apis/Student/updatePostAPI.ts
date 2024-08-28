import { request } from "../axios";

const updatePostAPI = (data: {
    user_id: number,
    post_id: number,
    content: string
}) => {
    return request("/api/student/post", {
        data: data,
        method: "PUT",
    });
};

export default updatePostAPI;