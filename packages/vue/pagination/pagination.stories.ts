import type { Meta, StoryFn } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MznPagination from './pagination.vue';
import type { PaginationProps } from './pagination.types';

export default {
  title: 'Navigation/Pagination',
} as Meta;

export const Playground: StoryFn<PaginationProps> = (args) => ({
  components: { MznPagination },
  setup: () => {
    const current = ref(1);

    return { args, current };
  },
  template: `
    <MznPagination
      :boundary-count="args.boundaryCount"
      :button-text="args.buttonText"
      :current="current"
      :disabled="args.disabled"
      :hint-text="args.hintText"
      :input-placeholder="args.inputPlaceholder"
      :page-size="args.pageSize"
      :show-jumper="args.showJumper"
      :sibling-count="args.siblingCount"
      :total="args.total"
      @change="current = $event"
    />
  `,
});

export const All: StoryFn = () => ({
  components: { MznPagination },
  setup: () => {
    const current = ref(1);
    const pageSize = ref(10);

    return {
      current,
      pageSize,
      pageSizeOptions: [10, 20, 50, 100],
      renderPageSizeOptionName: (p: number): string => `${p}`,
      renderResultSummary: (from: number, to: number, total: number): string =>
        `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        Basic
        <MznPagination
          :current="current"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          :render-page-size-option-name="renderPageSizeOptionName"
          :total="100"
          @change="current = $event"
          @change-page-size="pageSize = $event"
        />
      </div>
      <div>
        With Page Size Options
        <MznPagination
          show-page-size-options
          :current="current"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          page-size-label="每頁顯示："
          :render-page-size-option-name="renderPageSizeOptionName"
          :total="100"
          @change="current = $event"
          @change-page-size="pageSize = $event"
        />
      </div>
      <div>
        With Jumper Options
        <MznPagination
          :current="current"
          show-jumper
          button-text="確認"
          hint-text="前往"
          :render-page-size-option-name="renderPageSizeOptionName"
          :total="100"
          input-placeholder="1"
          @change="current = $event"
          @change-page-size="pageSize = $event"
        />
      </div>
      <div>
        Full Featured
        <MznPagination
          show-page-size-options
          :current="current"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          page-size-label="每頁顯示："
          show-jumper
          button-text="確認"
          hint-text="前往"
          input-placeholder="1"
          :render-result-summary="renderResultSummary"
          :render-page-size-option-name="renderPageSizeOptionName"
          :total="100"
          @change="current = $event"
          @change-page-size="pageSize = $event"
        />
      </div>
    </div>
  `,
});

Playground.args = {
  boundaryCount: 1,
  buttonText: '確認',
  hintText: '前往',
  inputPlaceholder: '1',
  pageSize: 5,
  showJumper: false,
  siblingCount: 1,
  total: 100,
};
