import { forwardRef } from 'react';

export interface EmptyMainNotificationIconProps
  extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const EmptyMainNotificationIcon = forwardRef<
  SVGSVGElement,
  EmptyMainNotificationIconProps
>(function EmptyMainNotificationIcon(props, ref) {
  const { className, size = 64, ...rest } = props;

  return (
    <svg
      {...rest}
      className={className}
      fill="none"
      height={size}
      ref={ref}
      viewBox="0 0 44 47"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_8482_10235"
          x1="22"
          x2="20.7012"
          y1="33"
          y2="46.8785"
        >
          <stop stopColor="#9DA4AE" />
          <stop offset="1" stopColor="#E5E7EB" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_8482_10235"
          x1="44"
          x2="-3.06232"
          y1="-1.43647e-06"
          y2="35.9963"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#9DA4AE" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="40" fill="url(#paint0_linear_8482_10235)" r="7" />
      <path
        d="M6.69446 15.305C6.69446 6.85228 13.5467 0 21.9995 0C30.4522 0 37.3045 6.85228 37.3045 15.305V26.5731C37.3045 26.6145 37.3141 26.6552 37.3326 26.6922L43.2746 38.5521C43.6077 39.217 43.1242 40 42.3805 40H1.61938C0.875674 40 0.392197 39.2171 0.725289 38.5521L6.66632 26.6922C6.68483 26.6552 6.69446 26.6145 6.69446 26.5731V15.305Z"
        fill="url(#paint1_linear_8482_10235)"
      />
    </svg>
  );
});
