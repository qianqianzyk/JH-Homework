import { createRouter, createWebHistory } from 'vue-router'
import { login, reg, home, student, admin } from '@/pages'
import {ElNotification} from "element-plus"
import {h} from "vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/" ,
            redirect: () => {
                return localStorage.getItem("login") ? '/home' : '/login'
            },
        },
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/reg',
            name: 'reg',
            component: reg,
        },
        {
            path: '/home',
            name: 'home',
            component: home,
        },
        {
            path: '/student',
            name: 'student',
            component: student,
        },
        {
            path: '/admin',
            name: 'admin',
            component: admin,
        }
    ],
})

router.beforeEach((to, _, next) => {
    const loginDataString = localStorage.getItem("login") || '{}';
    const loginData = JSON.parse(loginDataString);
    if (loginData.loginSession === false) {
        if (to.path === "/login") {
            next();
        } else if (to.path === "/reg") {
            next();
        } else {
            ElNotification({
                title: "失败",
                message: h("i", { style: "color: teal" }, "请先登录！"),
            });
            next("/login");
        }
    } else if (to.path === '/admin') {
        if (localStorage.getItem('userType') !== '2' ) {
            ElNotification({
                title: "失败",
                message: h("i", { style: "color: teal" }, "您没有权限访问！"),
            });
            next("/home");
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;