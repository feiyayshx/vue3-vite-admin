<!-- 消息通知卡片组件 -->
<style lang="scss" scoped>
$spaceSize: 12px;

.notification-card {
  position: relative;
  display: flex;
  margin-top: 16px;
  border-radius: 2px;
  padding: 12px 16px;
  width: 397px;
  text-align: left;
  background: #FFFFFF;
  flex-direction: column;

  &:first-child {
    margin-top: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
    width: 100%;

    .card-header-title {
      position: relative;
      padding-top: 2px;
      max-width: 50%;
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      color: #262626;
      line-height: 22px;

      &::before {
        height: 16px;
      }

      &.label {
        padding-left: 10px;

        &::after {
          position: absolute;
          top: 50%;
          left: 0;
          width: 4px;
          height: 16px;
          background-color: $color-primary;
          transform: translateY(-50%);
          content: "";
        }
      }

      .ellipsis-text {
        line-height: inherit;
      }
    }

    .card-header-tip {
      padding-left: 20px;
      min-width: 0;
      font-size: 16px;
      text-align: right;
      color: #262626;
      flex: 1;
    }
  }

  .card-body {
    display: flex;
    margin-top: 6px;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: $spaceSize;
    border-top: 1px solid #D9D9D9;
    padding-top: $spaceSize;
  }
}

// el组件样式
:deep(.el-button) {
  margin-left: 8px;
  font-size: 16px;
}
</style>

<template>
  <div class="notification-card">
    <div class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot name="main" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
</script>
