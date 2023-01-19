import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

export const slideUp = keyframes`
  0% {
    transform: translateY(50px);
  }

  100% {
    transform: translateY(0);
  }
`

export const slideDown = keyframes`
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(50px);
  }
`