import type { SVGProps } from 'react'

/**
 * Small brand icons that are not part of the icon set we use (lucide-react
 * removed brand logos in v1). Drawn with the same 24×24, 1.7px stroke style
 * so they sit comfortably next to the other icons.
 */
export function InstagramIcon({
  size = 24,
  strokeWidth = 1.7,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
