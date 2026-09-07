<script setup lang="ts">
import { computed } from 'vue';
import { paginationItemClasses as classes } from '@mezzanine-ui/core/pagination';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotHorizontalIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { PaginationItemProps } from './pagination-item.types';

/**
 * 分頁列上的單一項目：頁碼、上一頁、下一頁或省略號。
 *
 * `type` 決定長相 —— `page` 顯示頁碼、`previous` / `next` 顯示箭頭、`ellipsis`
 * 顯示三個點且不是按鈕。
 *
 * @example
 * ```vue
 * <MznPaginationItem :page="3" type="page" />
 * <MznPaginationItem type="ellipsis" />
 * ```
 *
 * @see MznPagination 排出這些項目的容器
 */
const props = withDefaults(defineProps<PaginationItemProps>(), {
  active: false,
  disabled: false,
  page: 1,
  type: 'page',
});

const icons: Record<string, IconDefinition> = {
  next: ChevronRightIcon,
  previous: ChevronLeftIcon,
};

const buttonIcon = computed(
  (): IconDefinition | undefined => icons[props.type],
);

const ellipsisClasses = computed((): string =>
  clsx(classes.host, classes.ellipsis, {
    [classes.disabled]: props.disabled,
  }),
);

const buttonClasses = computed((): string =>
  clsx(classes.host, classes.button, {
    [classes.active]: props.active,
    [classes.disabled]: props.disabled,
  }),
);
</script>

<template>
  <div v-if="type === 'ellipsis'" :class="ellipsisClasses">
    <MznIcon :icon="DotHorizontalIcon" />
  </div>
  <button v-else :class="buttonClasses" :disabled="disabled" type="button">
    <MznIcon v-if="buttonIcon" :icon="buttonIcon" />
    <MznTypography v-if="type === 'page'" variant="label-primary">
      {{ page }}
    </MznTypography>
  </button>
</template>
