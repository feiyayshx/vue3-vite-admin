<template>
  <div class="login-container">
    <section class="login-wrapper">
      <el-tabs size="large" class="login-tabs-block" v-model="activeTab">
        <el-tab-pane label="密码登录" name="password"></el-tab-pane>
        <el-tab-pane label="快捷登录" name="mobile"></el-tab-pane>
      </el-tabs>
      <!-- 密码登录 -->
      <el-form
        v-if="activeTab === 'password'"
        class="login-form-block"
        :model="form"
        size="large"
        label-position="top"
      >
        <el-form-item label="账号">
          <el-input v-model="form.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="login-button-block">
          <el-button class="login-button-submit" type="primary" @click="onLogin">登录</el-button>
        </div>
      </el-form>
      <!-- 快捷登录 -->
      <div v-if="activeTab === 'mobile'">TODO...</div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Storage from '@/utils/storage.js'
import { TOKEN } from '@/constants/constant-storage.js'
import { useUserStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('password')

const form = reactive({
  account: 'admin',
  password: '123456'
})

const onLogin = () => {
  const tokenStr = `token${parseInt(100 * Math.random())}`
  Storage.set(TOKEN, tokenStr)
  userStore.setIsLogined(true)
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
@use '@/styles/common.scss' as *;

.login-container {
  height: 100%;

  @include flex-column(center);

  background: $bgColor;

  .login-wrapper {
    padding: 20px;
    width: 400px;
    background: #ffffff;
    box-shadow: 0 0 5px $shadowColor;
  }

  .login-form-block {
    .login-button-block {
      .login-button-submit {
        width: 100%;
      }
    }
  }
}
</style>
