<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        精弘小论坛
        <el-button type="text" class="logout-button" @click="logout">登出</el-button>
      </el-header>
      <el-divider class="full-divider" />
      <el-container>
        <el-aside width="200px">
          <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
          >
            <el-menu-item index="1" @click="displayContent('home')">
              <el-icon><location /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="2" @click="displayContent('personalInfo')">
              <el-icon><user /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="3" @click="displayContent('reportQuery')">
              <el-icon><QuestionFilled /></el-icon>
              <span>举报处理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <el-card v-if="activeContent === 'personalInfo'" class="box-card">
              <div slot="header" class="clearfix">
                <span class="header-text">个人信息</span>
              </div>
              <div v-if="newUserStore.userSession.userType === 1">
                <p><span class="bold-text">ID:</span> {{ newUserStore.userSession.id }}</p>
                <p><span class="bold-text">用户名:</span> {{ newUserStore.userSession.username }}</p>
                <p><span class="bold-text">姓名:</span> {{ newUserStore.userSession.name }}</p>
                <p><span class="bold-text">用户类型:</span> 学生</p>
              </div>
              <div v-else-if="newUserStore.userSession.userType === 2">
                <p><span class="bold-text">ID:</span> {{ newUserStore.userSession.id }}</p>
                <p><span class="bold-text">用户名:</span> {{ newUserStore.userSession.username }}</p>
                <p><span class="bold-text">姓名:</span> {{ newUserStore.userSession.name }}</p>
                <p><span class="bold-text">用户类型:</span> 管理员</p>
              </div>
              <div v-else>
                <p>用户信息未定义</p>
              </div>
            </el-card>
            <div v-if="activeContent === 'reportQuery'">
              <el-row :gutter="20" class="input-row">
                <el-col :span="18">
                  <el-input v-model="userIdInput" placeholder="请输入用户ID" class="input-user-id" />
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="fetchReportedPosts">查询</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="reportedPostList.length">
                <el-col :span="24" v-for="reportedPost in reportedPostList" :key="reportedPost.post_id" class="post-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        帖子ID: {{ reportedPost.post_id }}
                      </div>
                    </template>
                    <div class="post-content">
                      <span class="post-content-label">用户名:</span> {{ reportedPost.username }}
                    </div>
                    <div class="post-content">
                      <span class="post-content-label">帖子内容:</span> {{ reportedPost.content }}
                    </div>
                    <div class="post-reason">
                      <span class="post-reason-label">举报理由:</span> {{ reportedPost.reason }}
                    </div>
                    <template #footer>
                      <el-button type="primary" @click="confirmAction(reportedPost.post_id, 1)">同意</el-button>
                      <el-button type="danger" @click="confirmAction(reportedPost.post_id, 2)">拒绝</el-button>
                    </template>
                  </el-card>
                </el-col>
              </el-row>
              <div v-else>
                <p>未查询到数据</p>
              </div>
            </div>
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
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import loginStore from "@/stores/service/loginStore.ts";
import userStore from "@/stores/service/userStore.ts";
import router from "@/router";
import {onMounted, ref} from "vue";
import {useRequest} from "vue-hooks-plus";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {getReportedPostAPI, dealReportedPostAPI} from "@/apis";

const newLoginStore = loginStore();
const newUserStore = userStore();
const activeContent = ref('personalInfo');
const userIdInput = ref('');
interface reportedPost {
  post_id: number;
  username: string,
  content: string;
  reason: string;
}
const reportedPostList = ref<reportedPost[]>([]);

onMounted(() => {
  displayContent('personalInfo');
});

const fetchReportedPosts = () => {
  if (!userIdInput.value) {
    ElNotification.error('请输入需要查询的用户ID');
    return;
  }
  useRequest(() => getReportedPostAPI({
    user_id: Number(userIdInput.value),
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        reportedPostList.value = res.data.report_list;
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('获取举报帖子列表失败，请重试' + e);
    },
  });
};

const displayContent = (content: string) => {
  activeContent.value = content;
  if (activeContent.value === 'home') {
    router.push("/home");
  }
};

const confirmAction = (postId: number, approval: number) => {
  ElMessageBox.confirm(
      approval === 1 ? '确定要同意处理该举报吗?' : '确定要拒绝处理该举报吗?',
      '确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        dealReportedPost(postId, approval);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作已取消',
        });
      });
};

const dealReportedPost = (postId: number, approval: number) => {
  useRequest(() => dealReportedPostAPI({
    user_id: newUserStore.userSession.id,
    post_id: postId,
    approval: approval,
  }),{
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success('处理举报帖子成功');
        fetchReportedPosts();
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('处理举报帖子失败，请重试' + e);
    },
  });
};

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
  height: 86vh;
  width: 86vw;
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
  background-color: #fff;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.el-card {
  box-shadow: none; /* 去除卡片边框的阴影效果 */
  border: 1px solid #dcdfe6; /* 如果需要边框，可以设置边框颜色和样式 */
  max-width: 100%; /* 确保卡片不会超出其容器的宽度 */
  overflow: hidden; /* 确保内容不会超出卡片边界 */
}

.el-card .el-card__header {
  border-bottom: 1px solid #dcdfe6; /* 设置标题区域下方的边框（可选） */
}

.el-card .el-card__body {
  padding: 16px; /* 调整卡片内容的内边距 */
  box-sizing: border-box; /* 确保内边距不会影响宽度 */
}

.input-row {
  display: flex;
  align-items: center;
}

.input-user-id {
  width: 100%;
}

.header-text {
  font-weight: bold;
  font-size: 24px; /* 调整字体大小 */
}

.bold-text {
  font-weight: bold;
}

.post-content {
  margin-top: 20px; /* 增加“帖子内容”与“发帖时间”之间的间距 */
  text-align: left; /* 确保内容左对齐 */
}

.post-content-label {
  font-weight: bold; /* 加粗“帖子内容” */
  margin-right: 5px; /* 为标签和内容之间添加一点间距 */
}

.post-reason {
  margin-top: 20px; /* 增加“帖子内容”与“发帖时间”之间的间距 */
  text-align: left; /* 确保内容左对齐 */
}

.post-reason-label {
  font-weight: bold; /* 加粗“帖子内容” */
  margin-right: 5px; /* 为标签和内容之间添加一点间距 */
}
</style>