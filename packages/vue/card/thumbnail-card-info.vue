<script setup lang="ts">
import { computed } from 'vue';
import {
  cardClasses as classes,
  getFileTypeCategory,
} from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import type { ThumbnailCardInfoProps } from './thumbnail-card-info.types';

/**
 * 縮圖卡片下方的資訊列：檔案類型標記、標題、副標題與右側的動作。
 *
 * MznSingleThumbnailCard 與 MznFourThumbnailCard 共用這一段。
 *
 * @see MznSingleThumbnailCard 單張縮圖的卡片
 * @see MznFourThumbnailCard 四張縮圖的卡片
 */
const props = withDefaults(defineProps<ThumbnailCardInfoProps>(), {
  actionName: undefined,
  disabled: false,
  filetype: undefined,
  options: undefined,
  subtitle: undefined,
  title: undefined,
  type: 'default',
});

const emit = defineEmits<{
  actionClick: [event: MouseEvent];
  optionSelect: [option: DropdownOption];
}>();

const filetypeClasses = computed((): string => {
  const category = props.filetype
    ? getFileTypeCategory(props.filetype)
    : undefined;

  return clsx(
    classes.thumbnailInfoFiletype,
    category ? `${classes.thumbnailInfoFiletype}--${category}` : undefined,
  );
});

function onActionClick(event: MouseEvent): void {
  event.stopPropagation();
  emit('actionClick', event);
}

const actionClass = classes.thumbnailInfoAction;
const contentClass = classes.thumbnailInfoContent;
const hostClass = classes.thumbnailInfo;
const mainClass = classes.thumbnailInfoMain;
const subtitleClass = classes.thumbnailInfoSubtitle;
const titleClass = classes.thumbnailInfoTitle;
</script>

<template>
  <div :class="hostClass">
    <div :class="mainClass">
      <div v-if="filetype" :class="filetypeClasses">
        {{ filetype.toUpperCase() }}
      </div>
      <div :class="contentClass">
        <span v-if="title" :class="titleClass">{{ title }}</span>
        <span v-if="subtitle" :class="subtitleClass">{{ subtitle }}</span>
      </div>
    </div>
    <div v-if="type === 'action'" :class="actionClass">
      <MznButton
        :disabled="disabled"
        size="sub"
        type="button"
        variant="base-text-link"
        @click="onActionClick"
      >
        {{ actionName }}
      </MznButton>
    </div>
    <div v-else-if="type === 'overflow'" :class="actionClass">
      <MznDropdown
        :disabled="disabled"
        :global-portal="false"
        mode="single"
        :options="options ?? []"
        @select="emit('optionSelect', $event)"
      >
        <template #default="triggerProps">
          <MznButton
            v-bind="triggerProps"
            :disabled="disabled"
            :icon="DotHorizontalIcon"
            icon-type="icon-only"
            size="sub"
            type="button"
            variant="base-text-link"
          />
        </template>
      </MznDropdown>
    </div>
  </div>
</template>
