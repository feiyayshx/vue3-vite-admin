<template>
  <div class="base-tags">
    <el-scrollbar style="flex: 1">
      <div class="tags-content">
        <div class="tag-item active">
          <span class="tag-title">商票渠道数据</span>
          <el-icon class="icon-close" size="18"><Close /></el-icon>
        </div>
        <div class="tag-item">
          <span class="tag-title">商票交易数据</span>
          <el-icon class="icon-close" size="18"><Close /></el-icon>
        </div>
      </div>
    </el-scrollbar>
    <div class="tags-operation">
      <el-icon><ArrowDownBold /></el-icon>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.base-tags {
  border-bottom: 1px solid $base-border;
  background-color: $basic-white;

  @include flex;

  .tags-content {
    display: flex;
    width: 100%;
    height: 40px;

    .tag-item {
      @include flex(center, center);

      position: relative;
      padding: 0 16px;
      flex-shrink: 0;

      &:not(:first-child)::before {
        position: absolute;
        top: 11px;
        left: 0;
        width: 1px;
        height: 18px;
        background: $base-border;
        content: '';
      }

      .tag-title {
        font-size: $font-size-medium;
        color: $base-text;
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }

      .icon-close {
        margin-left: 8px;
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }

      &.active {
        background-color: $tag-active-bg;

        .tag-title,
        .icon-close {
          color: $color-primary;
        }
      }
    }
  }

  .tags-operation {
    border-left: 1px solid $dark-border;
    width: 40px;
    height: 100%;
    cursor: pointer;

    @include flex(center, center);
  }
}
</style>
