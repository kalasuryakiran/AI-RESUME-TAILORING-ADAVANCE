import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12.5 12.5 14 14l-1.5 1.5" />
      <path d="m14 17 1.5-1.5-1.5-1.5" />
      <path d="m17 14-1.5 1.5 1.5 1.5" />
      <path d="M9.5 15.5 11 17l-1.5 1.5" />
      <path d="m11 20 1.5-1.5-1.5-1.5" />
    </svg>
  ),
};
