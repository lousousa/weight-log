import { useEffect, useRef, useState } from 'react'
import { ILogEntry } from '@/types'
import styled from 'styled-components'

interface IProps {
  data: ILogEntry[]
}

type ElementPosition = {
  x: number,
  y: number
}

export default function Chart({data}: IProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [dotsPosition, setDotsPosition] = useState<ElementPosition[]>([])

  useEffect(() => {
    if (!canvas.current) return

    canvas.current.width = 1280
    canvas.current.height = 360

    const ctx = canvas.current.getContext('2d')
    if (!ctx) return

    let minValue = Number.MAX_VALUE
    let maxValue = 0

    data.forEach(value => {
      const parsed = parseFloat(value.weight)

      if (parsed < minValue) minValue = parsed
      if (parsed > maxValue) maxValue = parsed
    })

    const xStep = canvas.current.width / (data.length - 1)
    const yStep = canvas.current.height / (maxValue - minValue)
    const dotsPosition = []

    for (let i = 0; i < data.length - 1; i++) {
      const current = parseFloat(data[i].weight)
      const next = parseFloat(data[i + 1].weight)

      const x1 = i * xStep
      const y1 = (current - minValue) * yStep
      const x2 = (i + 1) * xStep
      const y2 = (next - minValue) * yStep

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)

      if (i === 0) dotsPosition.push({x: x1, y: y1})

      dotsPosition.push({x: x2, y: y2})
    }

    setDotsPosition(dotsPosition)

    ctx.stroke()
  }, [canvas, data])

  return <ChartSection>
    <ChartWrapper>
      <canvas ref={canvas}/>

      {dotsPosition.map((dotPosition, idx) => (
        <Dot key={idx} position={dotPosition} />
      ))}
    </ChartWrapper>
  </ChartSection>
}

const ChartSection = styled.div`
  padding: 16px;
`

const ChartWrapper = styled.div`
  background-color: #a2d2ff;
  padding: 16px;
  border-radius: 8px;
  position: relative;
`

const Dot = styled.div<{position: ElementPosition}>`
  ${props => `
    // 16 = wrapper's padding; 5 = half dot size.
    --left: ${props.position.x + 16 - 5}px;
    --top: ${props.position.y + 16 - 5}px;
  `}

  position: absolute;
  left: var(--left);
  top: var(--top);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #003566;
  cursor: pointer;
  box-sizing: content-box;

  &:hover {
    border: 4px solid #fff;
    margin: -4px 0 0 -4px;
  }
`