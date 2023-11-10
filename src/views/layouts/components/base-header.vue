<template>
  <div class="header-wrapper">
    <div class="header-left-block">
      <img src="/vite.svg" class="header-logo">
      <span class="header-title">system admin</span> 
    </div>
    <div class="header-right-block"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.header-wrapper {
  height:100%;
  @include flex($justify:center);
  .header-left-block {
    @include flex($justify:center);
    .header-logo {
      width:28px;
      height:28px;
    }
    .header-title {
      color:#ffffff;
      
    }
  }
  .header-right-block {
    height:100%;
    flex:1;
  }

}
</style>
