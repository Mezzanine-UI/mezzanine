import { forwardRef } from 'react';

export interface EmptyMainInitialDataIconProps
  extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const EmptyMainInitialDataIcon = forwardRef<
  SVGSVGElement,
  EmptyMainInitialDataIconProps
>(function EmptyInitialDataIcon(props, ref) {
  const { className, size = 64, ...rest } = props;

  return (
    <svg
      {...rest}
      className={className}
      fill="none"
      height={size}
      ref={ref}
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_15033_10920"
          x1="27.52"
          x2="5.12"
          y1="11.7333"
          y2="52.6933"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#9DA4AE" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_15033_10920"
          x1="43.2"
          x2="38.2673"
          y1="11.7333"
          y2="52.0904"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#9DA4AE" />
        </linearGradient>
        <clipPath id="clip0_15033_10920">
          <rect fill="white" height="64" width="64" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_15033_10920)">
        <path
          d="M5.12 11.7333H27.52V52.6933H6.11999C5.56771 52.6933 5.12 52.2456 5.12 51.6933V11.7333Z"
          fill="url(#paint0_linear_15033_10920)"
        />
        <path
          d="M5.10416 11.7333H27.4282L22.3184 27.5737C22.1852 27.9867 21.8007 28.2667 21.3667 28.2667H1.14414C0.465656 28.2667 -0.0158672 27.6054 0.192428 26.9597L5.10416 11.7333Z"
          fill="#E5E7EB"
        />
        <path
          d="M27.52 11.7333H58.88V51.6933C58.88 52.2456 58.4323 52.6933 57.88 52.6933H27.52V11.7333Z"
          fill="url(#paint1_linear_15033_10920)"
        />
        <path
          d="M27.4282 11.7333H58.8871L63.7988 26.9597C64.0071 27.6054 63.5255 28.2667 62.8471 28.2667H33.4897C33.0557 28.2667 32.6712 27.9867 32.5379 27.5737L27.4282 11.7333Z"
          fill="#E5E7EB"
        />
      </g>
    </svg>
  );
});
