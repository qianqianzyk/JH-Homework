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
            <div class="registerData">
              <div style="text-align: center ; margin-left: 120px">
                <h3>注册</h3>
              </div>
              <el-form :model="form" label-width="120px">
                <el-form-item label="账号">
                  <el-input v-model="form.username" placeholder="请输入您的学号或管理工号"/>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="form.name" placeholder="请输入您姓名"/>
                </el-form-item>
                <el-form-item label="身份">
                  <el-select v-model="form.user_type" placeholder="请选择您的身份">
                    <el-option label="学生" value= "1" />
                    <el-option label="管理员" value= "2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="form.password" placeholder="长度大于8位，小于16位"/>
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input v-model="form.confirm_password" placeholder="请再次输入密码"/>
                </el-form-item>
                <div class="login-link">
                  <router-link to="/login">已经有账号了？快来登录吧！</router-link>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="register" class="button">注册</el-button>
                  <el-button class="button" @click="clear">清空</el-button>
                </el-form-item>
              </el-form>
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
import {reactive} from "vue";
import { ElNotification } from "element-plus";
import loginStore from "@/stores/service/loginStore.ts";
import userStore from "@/stores/service/userStore.ts";
import {registerAPI} from "@/apis";
import router from "@/router";
import {closeLoading, startLoading} from "@/utilities";
import {useRequest} from "vue-hooks-plus";

const newLoginStore = loginStore();
const newUserStore = userStore();

const form = reactive({
  username: "",
  name: "",
  user_type: "",
  password: "",
  confirm_password: "",
});

const register = () => {
  if (form.username !== "" && form.name !== "" && form.user_type !== "" && form.confirm_password!== "" && form.password !== "") {
    if (form.password !== form.confirm_password) {
      ElNotification({
        title: "Error",
        message: "注册失败,密码不一致！",
        type: "error",
      });
    }
  }
    useRequest(() => registerAPI({
      password: form.password,
      username: form.username,
      name: form.name,
      user_type: Number(form.user_type),
    }),{
      onBefore: () => startLoading(),
      onSuccess(res: any){
        console.log(res)
        if(res.code === 200) {
          ElNotification.success('注册成功');
          newUserStore.setUserInfo({
            id: -1,
            name: form.name,
            userType: Number(form.user_type),
            username: form.username,
          })
          router.push('/login')
        } else if (res.code === 200502) {
          ElNotification({
            title: "Error",
            message: "注册失败,用户名必须为纯数字",
            type: "error",
          });
        } else if (res.code === 200503) {
          ElNotification({
            title: "Error",
            message: "注册失败,密码长度必须在8-16位",
            type: "error",
          });
        } else if (res.code === 200504) {
          ElNotification({
            title: "Error",
            message: "注册失败,用户类型错误",
            type: "error",
          });
        } else if (res.code === 200505) {
          ElNotification({
            title: "Error",
            message: "注册失败,用户名已存在",
            type: "error",
          });
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e){
        ElNotification.error('注册失败，请重试' + e);
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
  form.username= "";
  form.name= "";
  form.user_type= "";
  form.password= "";
  form.confirm_password= "";
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

.registerData {
  border: 1px solid black;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  width: 450px;
  max-width: 90vw;
  height: auto;
}

.login-link {
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
