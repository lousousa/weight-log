import { SVGProps } from "react"

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 6.5V2a1.5 1.5 0 0 1 3 0v4.5H14a1.5 1.5 0 0 1 0 3H9.5V14a1.5 1.5 0 0 1-3 0V9.5H2a1.5 1.5 0 0 1 0-3h4.5z"
    />
  </svg>
)

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 23.332 23.333" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      d="M16.043,11.667L22.609,5.1c0.963-0.963,0.963-2.539,0-3.502l-0.875-0.875c-0.963-0.964-2.539-0.964-3.502,0L11.666,7.29  L5.099,0.723c-0.962-0.963-2.538-0.963-3.501,0L0.722,1.598c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.539,0,3.501l0.876,0.875c0.963,0.963,2.539,0.963,3.501,0l6.567-6.565l6.566,6.565  c0.963,0.963,2.539,0.963,3.502,0l0.875-0.875c0.963-0.963,0.963-2.539,0-3.501L16.043,11.667z"
    />
  </svg>
)

export const CheckMarkIcon = () => (
  <svg
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z"
    />
  </svg>
)