import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * SVG pictogram for Empty "initial-data" type in main size.
 * @internal
 */
@Component({
  selector: 'mzn-empty-main-initial-data-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      fill="none"
      height="64"
      viewBox="0 0 64 64"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="mzn_empty_initial_data_grad0"
          x1="27.52"
          x2="5.12"
          y1="11.7333"
          y2="52.6933"
        >
          <stop stop-color="var(--mzn-color-background-neutral-subtle)" />
          <stop offset="1" stop-color="var(--mzn-color-background-neutral)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="mzn_empty_initial_data_grad1"
          x1="43.2"
          x2="38.2673"
          y1="11.7333"
          y2="52.0904"
        >
          <stop stop-color="var(--mzn-color-background-neutral-subtle)" />
          <stop offset="1" stop-color="var(--mzn-color-background-neutral)" />
        </linearGradient>
        <clipPath id="mzn_empty_initial_data_clip0">
          <rect fill="white" height="64" width="64" />
        </clipPath>
      </defs>
      <g clip-path="url(#mzn_empty_initial_data_clip0)">
        <path
          d="M5.12 11.7333H27.52V52.6933H6.11999C5.56771 52.6933 5.12 52.2456 5.12 51.6933V11.7333Z"
          fill="url(#mzn_empty_initial_data_grad0)"
        />
        <path
          d="M5.10416 11.7333H27.4282L22.3184 27.5737C22.1852 27.9867 21.8007 28.2667 21.3667 28.2667H1.14414C0.465656 28.2667 -0.0158672 27.6054 0.192428 26.9597L5.10416 11.7333Z"
          fill="#E5E7EB"
        />
        <path
          d="M27.52 11.7333H58.88V51.6933C58.88 52.2456 58.4323 52.6933 57.88 52.6933H27.52V11.7333Z"
          fill="url(#mzn_empty_initial_data_grad1)"
        />
        <path
          d="M27.4282 11.7333H58.8871L63.7988 26.9597C64.0071 27.6054 63.5255 28.2667 62.8471 28.2667H33.4897C33.0557 28.2667 32.6712 27.9867 32.5379 27.5737L27.4282 11.7333Z"
          fill="#E5E7EB"
        />
      </g>
    </svg>
  `,
})
export class MznEmptyMainInitialDataIcon {}
