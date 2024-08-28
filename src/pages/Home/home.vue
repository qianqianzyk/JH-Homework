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
            <el-menu-item index="1" @click="navigateTo('/home')">
              <el-icon><location /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="2" @click="showPostForm">
              <el-icon><Edit /></el-icon>
              <span>发帖</span>
            </el-menu-item>
            <el-menu-item index="3" @click="navigateToProfile">
              <el-icon><user /></el-icon>
              <span>个人</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <el-form v-show="isPostFormVisible" :model="form" class="post-form">
              <el-form-item label="内容">
                <el-input v-model="form.content" type="textarea" class="post-input" />
              </el-form-item>
              <el-form-item class="form-item">
                <el-button type="primary" @click="submitPost">发布</el-button>
                <el-button @click="cancelPost">取消</el-button>
              </el-form-item>
            </el-form>
            <div v-show="!isPostFormVisible">
              <el-row :gutter="20" v-if="postList.length">
                <el-col :span="24" v-for="post in postList" :key="post.id" class="post-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        帖子ID: {{ post.id }}
                        <el-button
                            v-if="shouldShowReportButton(post.user_id)"
                            type="text"
                            class="report-button"
                            @click="openReportDialog(post)"
                        >
                          举报
                        </el-button>
                      </div>
                    </template>
                    <div class="post-time">
                      <span class="post-time-label">发帖时间:</span> {{ formatTime(post.time) }}
                    </div>
                    <div>
                      <el-form v-if="editingPostId === post.id" :model="editingForm" class="edit-form">
                        <el-form-item label="帖子内容" class="edit-form-item">
                          <el-input v-model="editingForm.content" type="textarea" class="post-input" />
                        </el-form-item>
                      </el-form>
                      <div v-else class="post-content">
                        <span class="post-content-label">帖子内容:</span> {{ post.content }}
                      </div>
                    </div>
                    <template #footer>
                      <div v-if="isEditable(post.user_id)">
                        <el-button v-if="editingPostId !== post.id" type="text" @click="editPost(post)">编辑</el-button>
                        <el-button v-if="editingPostId !== post.id" type="text" @click="deletePost(post.id)">删除</el-button>
                        <el-button v-if="editingPostId === post.id" type="text" @click="savePost(post.id)">保存</el-button>
                        <el-button v-if="editingPostId === post.id" type="text" @click="cancelEdit">取消</el-button>
                      </div>
                    </template>
                  </el-card>
                </el-col>
              </el-row>
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

  <el-dialog
      title="举报帖子"
      v-model="reportDialogVisible"
      width="50%"
      @close="resetReportDialog"
  >
    <el-form :model="reportForm" label-width="100px">
      <el-form-item label="帖子ID">
        <el-input :value="currentPost.id" disabled />
      </el-form-item>
      <el-form-item label="发帖时间">
        <el-input :value="formatTime(currentPost.time)" disabled />
      </el-form-item>
      <el-form-item label="帖子内容">
        <el-input :value="currentPost.content" type="textarea" disabled />
      </el-form-item>
      <el-form-item label="举报理由">
        <el-input v-model="reportForm.reason" type="textarea" placeholder="请输入举报理由" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelReport">取消</el-button>
      <el-button type="primary" @click="submitReport">提交举报</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { ElNotification } from "element-plus";
import loginStore from "@/stores/service/loginStore.ts";
import userStore from "@/stores/service/userStore.ts";
import {createPostAPI, delPostAPI, getAllPostsAPI, updatePostAPI,reportPostAPI} from "@/apis";
import {closeLoading, startLoading} from "@/utilities";
import router from '@/router';
import {useRequest} from "vue-hooks-plus";

const newLoginStore = loginStore();
const newUserStore = userStore();
const isPostFormVisible = ref(false);
const form = ref({
  content: ''
});
const editingForm = ref({
  content: ''
});
const reportDialogVisible = ref(false);
const reportForm = ref({
  reason: ''
});
const currentPost = ref({ id: 0, content: '', user_id: 0, time: '' });

interface post {
  id: number;
  content: string;
  user_id: number;
  time: string;
}

const postList = ref<post[]>([]);
const editingPostId = ref<number | null>(null);

onMounted(() => {
  fetchPosts();
});

const navigateToProfile = () => {
  const userType = newUserStore.userSession.userType;
  if (userType === 1) {
    router.push('/student');
  } else if (userType === 2) {
    router.push('/admin');
  }
};

const shouldShowReportButton = (user_id: number) => {
  return newUserStore.userSession.id !== user_id;
};

const fetchPosts = () => {
  useRequest(() => getAllPostsAPI(), {
    onSuccess(res: any) {
      if (res.code === 200) {
        postList.value = res.data.post_list;
        console.log(postList.value)
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('获取帖子列表失败，请重试' + e);
    },
  });
};

const formatTime = (time: string) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const isEditable = (user_id: number) => {
  return newUserStore.userSession.id === user_id;
};

const editPost = (post: post) => {
  editingPostId.value = post.id;
  editingForm.value.content = post.content;
};

const deletePost = (id: number) => {
  useRequest(() => delPostAPI({
    user_id: newUserStore.userSession.id,
    post_id: id,
  }),{
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success('删除帖子成功');
        fetchPosts();
        router.push("/home");
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('删除帖子失败，请重试' + e);
    },
  });
};

const savePost = (id: number) => {
  useRequest(() => updatePostAPI({
    user_id: newUserStore.userSession.id,
    post_id: id,
    content: editingForm.value.content,
  }),{
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success('保存帖子成功');
        fetchPosts();
        router.push("/home");
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('保存帖子失败，请重试' + e);
    },
  });
};

const openReportDialog = (post: post) => {
  currentPost.value = post;
  reportDialogVisible.value = true;
  console.log(reportDialogVisible.value);
};

const submitReport = () => {
  if (!reportForm.value.reason.trim()) {
    ElNotification.error('举报理由不能为空');
    return;
  }

  useRequest(() => reportPostAPI({
    post_id: currentPost.value.id,
    user_id: newUserStore.userSession.id,
    reason: reportForm.value.reason,
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success('举报成功, 请等待管理员处理！');
        reportDialogVisible.value = false;
        fetchPosts();
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('举报失败，请重试' + e);
    },
  });
};

const resetReportDialog = () => {
  reportForm.value.reason = '';
  currentPost.value = { id: 0, content: '', user_id: 0, time: '' };
};

const cancelEdit = () => {
  editingPostId.value = null;
  fetchPosts();
};

const navigateTo = (route: string) => {
  isPostFormVisible.value = false;
  form.value.content = '';
  router.push(route);
  if (route === '/home') {
    fetchPosts();
  }
};

const showPostForm = () => {
  isPostFormVisible.value = true;
};

const submitPost = () => {
  const content = form.value.content;
  if (!content) {
    ElNotification.error({
      title: 'Error',
      message: '发帖失败，内容不能为空！',
      type: "error",
    });
    return;
  }
  useRequest(() => createPostAPI({
    content: content,
    user_id: newUserStore.userSession.id,
  }),{
    onBefore: () => startLoading(),
    onSuccess(res: any){
      console.log(res)
      if(res.code === 200) {
        ElNotification.success('发帖成功');
        router.push('/home');
        fetchPosts();
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('发帖失败，请重试' + e);
    },
    onFinally: () => closeLoading()
  })
};

const cancelReport = () => {
  resetReportDialog();
  reportDialogVisible.value = false;
  fetchPosts();
};

const cancelPost = () => {
  isPostFormVisible.value = false;
  form.value.content = '';
  fetchPosts();
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

.post-form {
  max-width: 500px; /* 设置表单的最大宽度 */
  margin: 0 auto; /* 使表单居中显示 */
}

.post-input {
  font-size: 14px; /* 增加输入框字体大小 */
  min-height: 200px; /* 设置输入框的高度 */
  min-width: 500px; /* 设置输入框的最小宽度 */
}

.card-header {
  display: flex;
  justify-content: space-between; /* 确保按钮在右侧对齐 */
  align-items: center; /* 垂直居中对齐 */
  font-size: 18px;
  font-weight: bold;
}

.report-button {
  margin-left: auto; /* 将按钮推到右边 */
  color: #f56c6c; /* 设置举报按钮的颜色（可根据需求调整） */
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

.post-time {
  display: flex; /* 使用 flexbox 进行布局 */
  align-items: center; /* 垂直居中 */
  text-align: left; /* 确保内容左对齐 */
}

.post-time-label {
  font-weight: bold; /* 加粗“发帖时间” */
  margin-right: 10px; /* 为标签和时间之间添加一点间距 */
}

.post-content {
  margin-top: 20px; /* 增加“帖子内容”与“发帖时间”之间的间距 */
  text-align: left; /* 确保内容左对齐 */
}

.post-content-label {
  font-weight: bold; /* 加粗“帖子内容” */
  margin-right: 5px; /* 为标签和内容之间添加一点间距 */
}

.edit-form {
  max-width: calc(100% - 32px); /* 保持与卡片宽度一致，考虑到内边距 */
  margin: 0; /* 移除外边距 */
  padding: 0; /* 移除内边距 */
  box-sizing: border-box;
}

.edit-form-item {
  font-size: 16px;
  font-weight: bold;
}

</style>
