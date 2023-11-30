<template>
  <div class="base-tags">
    <el-scrollbar style="flex: 1">
      <div class="tags-content">
        <div
          v-for="tag in tags.tagsList"
          :key="tag.path"
          :class="['tag-item', tag.path === route.path ? 'active' : '']"
        >
          <router-link class="tag-title" :to="tag.path">{{ tag.title }}</router-link>
          <el-icon
            v-if="tags.tagsList.length > 1"
            class="icon-close"
            size="18"
            @click="onCloseTag(tag)"
            ><Close
          /></el-icon>
        </div>
      </div>
    </el-scrollbar>
    <div class="tags-operation">
      <el-icon><ArrowDownBold /></el-icon>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '@/store'
import { useRoute } from 'vue-router'
const route = useRoute()
const { tags, removeTag } = useUserStore()

// 关闭标签
const onCloseTag = (tag) => {
  removeTag(tag, route.path)
}
</script>
<style lang="scss" scoped>
.base-tags {
  border-bottom: 1px solid $base-border;
  background-color: $basic-white;

  @include flex;

  .tags-content {
    display: flex;
    border-left: 1px solid $base-border;
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
        text-decoration: none;
        color: $base-text;
        outline: none;
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
