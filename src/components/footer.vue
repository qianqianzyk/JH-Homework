<template>
  <div class="foot_div">
    <div>
      <el-divider content-position="center">@qianqianzyk·2024</el-divider>
    </div>
    <div class="content">
      <el-descriptions :column="4" size="small" >
        <el-descriptions-item label="Github">
          <el-link href="https://github.com/qianqianzyk/JH-Homework">
            https://github.com/qianqianzyk/JH-Homework&ensp;&ensp;&ensp;
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="博客传送门"
        ><el-link href="https://qianqianzyk.top/">https://qianqianzyk.top/&ensp;&ensp;&ensp;</el-link>
        </el-descriptions-item><el-descriptions-item label="Designed by"
      >qianqianzyk</el-descriptions-item>

      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.foot_div {
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: 2%;
}
</style>