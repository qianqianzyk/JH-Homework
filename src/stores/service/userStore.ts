import {defineStore} from "pinia";
import {reactive} from "vue";
import {userInfo} from "@/types/userInfo.ts";

const userStore = defineStore(
    "user",
    () => {
        const userSession = reactive({
            id: -1,
            username: "未登录",
            name: "未登录",
            userType: -1,
        });

        const setUserInfo = (info: userInfo) : void => {
            userSession.id = info.id;
            userSession.username = info.username;
            userSession.name = info.name;
            userSession.userType = info.userType;
        };

        return {
            userSession,
            setUserInfo,
        };
    },
    {
        persist: true
    }
);

export default userStore;