<script setup lang="ts">
import { computed } from 'vue';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import clsx from 'clsx';
import MznTypography from '../typography/typography.vue';
import { useHash } from './use-hash';
import type { AnchorItemProps } from './anchor-item.types';

/**
 * Individual anchor link with hash tracking and smooth scrolling.
 * Tracks active state from the URL hash and inherits disabled state from its
 * parent. Internal to the anchor package.
 */
const props = withDefaults(defineProps<AnchorItemProps>(), {
  level: 1,
  parentAutoScrollTo: false,
  parentDisabled: false,
});

/**
 * Two roots — the link and its nested group — so nothing is forwarded
 * implicitly; `$attrs` is bound to the link, which is where React puts
 * `className`.
 */
defineOptions({ inheritAttrs: false });

const MAX_CHILDREN_PER_LEVEL = 3;

const currentHash = useHash();

const itemHash = computed((): string => {
  const index = props.href.indexOf('#');

  return index !== -1 ? props.href.slice(index) : '';
});

const isActive = computed(
  () => !!itemHash.value && currentHash.value === itemHash.value,
);

const isAutoScrollTo = computed(
  (): boolean | undefined => props.parentAutoScrollTo || props.autoScrollTo,
);

const isDisabled = computed(
  (): boolean | undefined => props.parentDisabled || props.disabled,
);

const renderableChildren = computed((): AnchorItemProps['subAnchors'] =>
  props.subAnchors &&
  props.subAnchors.length > 0 &&
  props.level < MAX_CHILDREN_PER_LEVEL
    ? props.subAnchors.slice(0, MAX_CHILDREN_PER_LEVEL)
    : undefined,
);

const itemClasses = computed((): string =>
  clsx(
    classes.anchorItem,
    isActive.value && classes.anchorItemActive,
    isDisabled.value && classes.anchorItemDisabled,
  ),
);

const nestedChildClasses = computed((): string =>
  clsx(
    props.level === 1 && classes.nestedLevel1,
    props.level === 2 && classes.nestedLevel2,
  ),
);

function handleClick(event: MouseEvent): void {
  if (isDisabled.value) {
    event.preventDefault();

    return;
  }

  // A hash in the href is navigated manually so the hashchange event always
  // fires, which is what drives the active state.
  if (itemHash.value && typeof window !== 'undefined') {
    event.preventDefault();

    if (window.location.hash !== itemHash.value) {
      window.history.pushState(null, '', itemHash.value);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }

    if (isAutoScrollTo.value) {
      const target = document.querySelector(itemHash.value);

      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  props.onClick?.();
}

const nestedClass = classes.nested;
</script>

<template>
  <a
    v-bind="$attrs"
    :aria-disabled="isDisabled"
    :class="itemClasses"
    :href="href"
    :tabindex="isDisabled ? -1 : undefined"
    :title="title"
    @click="handleClick"
  >
    <MznTypography color="inherit" variant="label-primary">
      {{ name }}
    </MznTypography>
  </a>

  <div v-if="renderableChildren" :class="nestedClass">
    <AnchorItem
      v-for="child in renderableChildren"
      :key="child.id"
      :auto-scroll-to="child.autoScrollTo"
      :class="nestedChildClasses"
      :disabled="child.disabled"
      :href="child.href"
      :id="child.id"
      :level="level + 1"
      :name="child.name"
      :on-click="child.onClick"
      :parent-auto-scroll-to="isAutoScrollTo"
      :parent-disabled="isDisabled"
      :sub-anchors="child.children"
      :title="child.title"
    />
  </div>
</template>
