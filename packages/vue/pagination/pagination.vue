<script setup lang="ts">
import { computed, h } from 'vue';
import type { VNodeChild } from 'vue';
import { paginationClasses as classes } from '@mezzanine-ui/core/pagination';
import MznTypography from '../typography/typography.vue';
import MznPaginationItem from './pagination-item.vue';
import MznPaginationJumper from './pagination-jumper.vue';
import MznPaginationPageSize from './pagination-page-size.vue';
import { usePagination } from './use-pagination';
import type { PaginationItem } from './use-pagination';
import type { PaginationProps } from './pagination.types';

/**
 * 分頁導覽列：頁碼、跳頁輸入框與每頁筆數選擇器。
 *
 * 給 `total` 與 `pageSize` 就會算出總頁數並排出頁碼；`boundaryCount` 決定首尾
 * 一定看得到幾頁，`siblingCount` 決定目前頁兩側各留幾頁，中間放省略號。
 * `showJumper` 與 `showPageSizeOptions` 分別開啟跳頁欄與每頁筆數選擇器。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPagination } from '@mezzanine-ui/vue/pagination';
 * <\/script>
 *
 * <template>
 *   <MznPagination :current="page" :total="100" @change="page = $event" />
 *
 *   <MznPagination
 *     button-text="確認"
 *     hint-text="前往"
 *     show-jumper
 *     :total="500"
 *     @change="page = $event"
 *   />
 * </template>
 * ```
 *
 * @see usePagination 只要分頁邏輯時的 composable
 * @see MznPaginationItem 每一個頁碼項目
 */
const props = withDefaults(defineProps<PaginationProps>(), {
  boundaryCount: 1,
  buttonText: undefined,
  current: 1,
  disabled: undefined,
  hintText: undefined,
  inputPlaceholder: undefined,
  itemRender: (item: PaginationItem) => h(MznPaginationItem, item),
  pageSize: 10,
  pageSizeLabel: undefined,
  pageSizeOptions: undefined,
  renderPageSizeOptionName: undefined,
  renderResultSummary: undefined,
  showJumper: false,
  showPageSizeOptions: false,
  siblingCount: 1,
  total: 0,
});

const emit = defineEmits<{
  change: [page: number];
  changePageSize: [pageSize: number];
}>();

const { items } = usePagination({
  boundaryCount: () => props.boundaryCount,
  current: () => props.current,
  disabled: () => props.disabled,
  onChange: (page) => emit('change', page),
  pageSize: () => props.pageSize,
  siblingCount: () => props.siblingCount,
  total: () => props.total,
});

const resultSummary = computed((): string | undefined =>
  props.renderResultSummary?.(
    props.pageSize * (props.current - 1) + 1,
    Math.min(props.pageSize * props.current, props.total),
    props.total,
  ),
);

const renderedItems = computed((): VNodeChild[] =>
  items.value.map((item) => props.itemRender(item)),
);

const containerClass = classes.container;
const itemClass = classes.item;
const itemListClass = classes.itemList;
const jumperClass = classes.jumper;
const pageSizeClass = classes.pageSize;
const resultSummaryClass = classes.resultSummary;
const hostClass = classes.host;
</script>

<template>
  <nav aria-label="pagination navigation" :class="hostClass">
    <MznTypography
      v-if="renderResultSummary"
      :class="resultSummaryClass"
      variant="label-primary"
    >
      {{ resultSummary }}
    </MznTypography>
    <li v-if="showPageSizeOptions" :class="pageSizeClass">
      <MznPaginationPageSize
        :disabled="disabled"
        :label="pageSizeLabel"
        :options="pageSizeOptions"
        :render-option-name="renderPageSizeOptionName"
        :value="pageSize"
        @change="emit('changePageSize', $event)"
      />
    </li>

    <ul :class="containerClass">
      <li>
        <ul :class="itemListClass">
          <li
            v-for="(item, index) in renderedItems"
            :key="index"
            :class="itemClass"
          >
            <component :is="() => item" />
          </li>
        </ul>
      </li>
      <li v-if="showJumper" :class="jumperClass">
        <MznPaginationJumper
          :button-text="buttonText"
          :disabled="disabled"
          :hint-text="hintText"
          :input-placeholder="inputPlaceholder"
          :page-size="pageSize"
          :total="total"
          @change="emit('change', $event)"
        />
      </li>
    </ul>
  </nav>
</template>
