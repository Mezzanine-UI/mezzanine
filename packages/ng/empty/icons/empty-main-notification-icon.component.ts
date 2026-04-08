import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * SVG pictogram for Empty "notification" type in main size.
 * @internal
 */
@Component({
  selector: 'mzn-empty-main-notification-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      fill="none"
      height="64"
      viewBox="0 0 44 47"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="mzn_empty_notification_grad0"
          x1="22"
          x2="20.7012"
          y1="33"
          y2="46.8785"
        >
          <stop stop-color="var(--mzn-color-background-neutral)" />
          <stop
            offset="1"
            stop-color="var(--mzn-color-background-neutral-subtle)"
          />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="mzn_empty_notification_grad1"
          x1="44"
          x2="-3.06232"
          y1="-1.43647e-06"
          y2="35.9963"
        >
          <stop stop-color="var(--mzn-color-background-neutral-subtle)" />
          <stop offset="1" stop-color="var(--mzn-color-background-neutral)" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="40" fill="url(#mzn_empty_notification_grad0)" r="7" />
      <path
        d="M6.69446 15.305C6.69446 6.85228 13.5467 0 21.9995 0C30.4522 0 37.3045 6.85228 37.3045 15.305V26.5731C37.3045 26.6145 37.3141 26.6552 37.3326 26.6922L43.2746 38.5521C43.6077 39.217 43.1242 40 42.3805 40H1.61938C0.875674 40 0.392197 39.2171 0.725289 38.5521L6.66632 26.6922C6.68483 26.6552 6.69446 26.6145 6.69446 26.5731V15.305Z"
        fill="url(#mzn_empty_notification_grad1)"
      />
    </svg>
  `,
})
export class MznEmptyMainNotificationIcon {}
