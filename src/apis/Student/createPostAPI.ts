import { request } from "../axios";

const createPostAPI = (data: {
    content: string,
    user_id: number
}) => {
    return request("/api/student/post", {
        data: data,
        method: "POST",
    });
};

export default createPostAPI