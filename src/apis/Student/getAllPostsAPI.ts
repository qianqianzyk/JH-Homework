import { request } from "../axios";

const getAllPostsAPI = () => {
    return request("/api/student/post", {
        method: "GET",
    });
};

export default getAllPostsAPI