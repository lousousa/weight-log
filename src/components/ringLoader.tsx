import styled from 'styled-components'

interface IProps {
  size: string
  color: string
}

export default function RingLoader({size, color}: IProps) {
  return (
    <Ring size={size} color={color}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Ring>
  )
}

const Ring = styled.div<{size: string, color: string}>`
  ${props => `
    --ring-color: ${props.color};
    --ring-size: ${props.size};
  `}

  @keyframes ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  display: inline-block;
  position: relative;
  width: var(--ring-size);
  height: var(--ring-size);

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: calc(var(--ring-size) * 4/5);
    height: calc(var(--ring-size) * 4/5);
    margin: calc(var(--ring-size) / 10);
    border: calc(var(--ring-size) / 10) solid var(--ring-color);
    border-radius: 50%;
    animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--ring-color) transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`
