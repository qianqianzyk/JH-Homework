<template>
  <div class="common-layout">
    <el-container class="full-container">
      <el-header class="header">
        精弘小论坛
        <el-button type="text" class="logout-button" @click="logout">登出</el-button>
      </el-header>
      <el-divider class="full-divider" />
      <el-main class="main-content">
        <el-row class="row-content">
          <el-col :span="8" class="image-col">
            <div>
              <el-image class="img" src="src/assets/JHcartoon.png"></el-image>
            </div>
          </el-col>
          <el-col :span="13" class="login-col">
            <div class="loginData">
              <el-container>
                <label class="label">Account&nbsp;&nbsp;&nbsp;</label>
                <el-input v-model="username" placeholder="请输入您的账号" class="input"/>
              </el-container>
              <br />
              <el-container>
                <label class="label">Password</label>
                <el-input
                    v-model="password"
                    type="password"
                    placeholder="请输入您的密码"
                    show-password
                    class="input"
                />
              </el-container>
              <div class="register-link">
                <router-link to="/reg">还没有账号？快来注册一个吧！</router-link>
              </div>
              <el-button type="primary" @click="login" class="button">登录</el-button>
              <el-button @click="clear" class="button">清空</el-button>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-divider>@qianqianzyk·2024</el-divider>
      <el-footer>
        <el-descriptions :column="5" size="small">
          <el-descriptions-item label="QQ">3265569512&ensp;&ensp;&ensp;</el-descriptions-item>
          <el-descriptions-item label="Github仓库地址">
            <el-link href="https://github.com/qianqianzyk/JH-Homework">
              https://github.com/qianqianzyk/JH-Homework&ensp;&ensp;&ensp;
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="博客地址">
            <el-link href="https://qianqianzyk.top/">https://qianqianzyk.top/&ensp;&ensp;&ensp;</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="Designed by">qianqianzyk</el-descriptions-item>
        </el-descriptions>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
import {useRequest} from "vue-hooks-plus";
import {loginAPI} from "@/apis";
import {ElNotification} from "element-plus";
import loginStore from "@/stores/service/loginStore.ts";
import userStore from "@/stores/service/userStore.ts";
import router from "@/router";
import {closeLoading, startLoading} from "@/utilities";

const password = ref('');
const username = ref('');
const newLoginStore = loginStore();
const newUserStore = userStore();

const login = () => {
 useRequest(() => loginAPI({
   username:username.value,
   password:password.value
 }),{
   onBefore: () => startLoading(),
   onSuccess(res: any){
     console.log(res)
     if(res.code === 200) {
       ElNotification.success('登陆成功');
       const responseData = res.data;
       newLoginStore.setLogin(true);
       localStorage.setItem("login", String(true));
       localStorage.setItem("userType", String(responseData.user_type));
       newUserStore.setUserInfo({
         id: responseData.user_id,
         name: newUserStore.userSession.name,
         userType: responseData.user_type,
         username: newUserStore.userSession.username,
       })
       router.push('/home')
     } else if (res.code === 200506) {
       ElNotification({
         title: "Error",
         message: "登录失败,用户不存在",
         type: "error",
       });
     } else if (res.code === 200507) {
       ElNotification({
         title: "Error",
         message: "登录失败,密码错误",
         type: "error",
       });
     } else{
       ElNotification.error(res.msg);
     }
   },
   onError(e){
     ElNotification.error('登录失败，请重试' + e);
   },
   onFinally: () => closeLoading()
 })
}

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  newLoginStore.setLogin(false);
  newUserStore.setUserInfo( {
    id: -1,
    name: "未登录",
    userType: -1,
    username: "未登录",
  });
  router.push("/login");
};

const clear = () => {
 password.value = ''
 username.value = ''
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.common-layout {
  display: flex;
  flex-direction: column;
  height: 85vh;
  width: 85vw;
}

.full-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.full-divider {
  width: 100%;
  margin: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 40px;
  font-family: '楷体', 'KaiTi', serif;
  background-color: #fff; /* 修改背景颜色，如果需要 */
  color: #000;
}

.logout-button {
  color: #000;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
}

.el-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.el-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.el-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}


.row-content {
  width: 100%;
  display: flex;
  max-width: 100%;
}

.img {
  max-width: 80%;
  max-height: 80%;
  height: auto;
  width: auto;
  position: relative;
  left: 100px;
  top: -30px;
}

.login-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.loginData {
  border: 1px solid black;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  width: 450px;
  max-width: 90vw;
  height: auto;
}

.register-link {
  font-size: 12px;
  margin-top: 10px;
  text-align: right;
}

.label {
  margin-right: 10px;
  font-weight: bolder;
}

.button {
  margin: 20px;
  width: 100px;
}
</style>
