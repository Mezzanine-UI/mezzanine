import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * SVG pictogram for Empty "result" type in main size.
 * @internal
 */
@Component({
  selector: '[mznEmptyMainResultIcon]',
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
          id="mzn_empty_result_grad0"
          x1="28.9684"
          x2="24.6011"
          y1="-4.50146"
          y2="54.5206"
        >
          <stop stop-color="var(--mzn-color-background-neutral-subtle)" />
          <stop offset="1" stop-color="var(--mzn-color-background-neutral)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="mzn_empty_result_grad1"
          x1="32"
          x2="30.1462"
          y1="23.8542"
          y2="64.7656"
        >
          <stop stop-color="var(--mzn-color-background-neutral-subtle)" />
          <stop offset="1" stop-color="var(--mzn-color-background-neutral)" />
        </linearGradient>
        <clipPath id="mzn_empty_result_clip0">
          <rect fill="white" height="64" width="64" />
        </clipPath>
      </defs>
      <g clip-path="url(#mzn_empty_result_clip0)">
        <path
          d="M0 10.0332V53.8437C0 54.396 0.447713 54.8437 0.999998 54.8437L56.9368 54.8437C57.4891 54.8437 57.9368 54.396 57.9368 53.8437V14.8554C57.9368 14.3031 57.4891 13.8554 56.9368 13.8554H30.1099C29.8426 13.8554 29.5864 13.7483 29.3985 13.5582L25.2219 9.33041C25.034 9.14024 24.7778 9.0332 24.5105 9.0332H1C0.447715 9.0332 0 9.48092 0 10.0332Z"
          fill="url(#mzn_empty_result_grad0)"
        />
        <path
          d="M5.90507 24.6622C5.9969 24.1929 6.40821 23.8542 6.88646 23.8542H62.7854C63.4147 23.8542 63.8876 24.4286 63.7668 25.0463L58.0949 54.0357C58.0031 54.5051 57.5918 54.8437 57.1135 54.8437H1.21461C0.58527 54.8437 0.112379 54.2693 0.23322 53.6517L5.90507 24.6622Z"
          fill="url(#mzn_empty_result_grad1)"
        />
      </g>
    </svg>
  `,
})
export class MznEmptyMainResultIcon {}
