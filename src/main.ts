import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from './App.vue';
import router from "./router";
import pinia from "./stores";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 创建并配置 Vue 应用实例
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ElementPlus);

// 全局注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 挂载 Vue 应用
app.mount("#app");
