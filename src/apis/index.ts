import loginAPI from '@/apis/User/loginAPI.ts'
import registerAPI from "@/apis/User/registerAPI.ts";
import createPostAPI from "@/apis/Student/createPostAPI.ts";
import getAllPostsAPI from "@/apis/Student/getAllPostsAPI.ts";
import delPostAPI from "@/apis/Student/delPostAPI.ts";
import updatePostAPI from "@/apis/Student/updatePostAPI.ts";
import reportPostAPI from "@/apis/Student/reportPostAPI.ts";
import getSelfReportedPostAPI from "@/apis/Student/getSelfReportedPostAPI.ts";
import getReportedPostAPI from "@/apis/Admin/getReportedPostAPI.ts";
import dealReportedPostAPI from "@/apis/Admin/dealReportedPostAPI.ts";
export {
    loginAPI,
    registerAPI,
    createPostAPI,
    getAllPostsAPI,
    delPostAPI,
    updatePostAPI,
    reportPostAPI,
    getSelfReportedPostAPI,
    getReportedPostAPI,
    dealReportedPostAPI,
}