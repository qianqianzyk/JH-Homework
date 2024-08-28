<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo menu"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="0"><div class="flex items-center">
      <span class="text-large font-600 mr-3"> 论坛系统  </span>
      &ensp;&ensp;&ensp;
      <el-tag>2024暑期前端大作业</el-tag>
    </div></el-menu-item>
    <div class="flex-grow" />
    <div class="button_div">
      <div class="button" v-show="!loginSession" :key="1">
        <el-button type="primary" @click="pushToLogin" >登录</el-button>
        <el-button class="ml-2" @click="pushToRegister" >注册</el-button>
      </div>
      <div v-show="loginSession" :key="2">
        <div style="display: flex ; flex-direction:row">
          <p>{{isName}},欢迎回来！&ensp;&ensp;</p>
          <el-button class="ml-2 button" @click="pushToOut" >退出</el-button>
        </div>
      </div>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import userStore from "../stores/service/userStore";
import loginStore from "../stores/service/loginStore";
import {storeToRefs} from "pinia";

const newUserStore = userStore();
const newLoginStore = loginStore();
const { loginSession } = storeToRefs(newLoginStore);
const { userSession } = storeToRefs(newUserStore);
const isName = localStorage.getItem("name");
const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const pushToLogin = () => {
  router.push("/user/login");
};

const pushToRegister = () => {
  router.push("/user/reg");
};

const pushToOut = () => {
  localStorage.clear();
  sessionStorage.clear();
  loginSession.value = false;
  userSession.value = {
    id: -1,
    username: "未登录",
    name: "未登录",
    userType: -1,
  };
  router.push("/user/login");
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.menu {
  position: fixed;
  left: 2%;
  right: 2%;
  top: 2%;
}

.button_div {
  position: relative;
}

.button {
  margin-top: 12px;
}
</style>