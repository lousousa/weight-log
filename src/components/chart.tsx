import { useEffect, useRef, useState } from 'react'
import { ILogEntry } from '@/types'
import styled from 'styled-components'
import moment from 'moment'

interface IProps {
  data: ILogEntry[]
}

type CheckpointInfo = {
  x: number,
  y: number,
  data: ILogEntry
}

export default function Chart({data}: IProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [checkpointsInfo, setCheckpointsInfo] = useState<CheckpointInfo[]>([])

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
    const yStep = (canvas.current.height - 3) / (maxValue - minValue)
    const checkpointsInfo = []

    data = data.sort((a, b) => a.date < b.date ? -1 : 1)

    for (let i = 0; i < data.length - 1; i++) {
      const current = parseFloat(data[i].weight)
      const next = parseFloat(data[i + 1].weight)

      const x1 = i * xStep
      const y1 = (maxValue - current) * yStep
      const x2 = (i + 1) * xStep
      const y2 = (maxValue - next) * yStep

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)

      if (i === 0) checkpointsInfo.push({x: x1, y: y1, data: data[i]})

      checkpointsInfo.push({x: x2, y: y2, data: data[i + 1]})
    }

    setCheckpointsInfo(checkpointsInfo)

    ctx.lineWidth = 3
    ctx.strokeStyle = '#eff2ff'
    ctx.stroke()
  }, [canvas, data])

  return <ChartSection>
    <ChartWrapper>
      <canvas ref={canvas}/>

      {checkpointsInfo.map((checkpointInfo, idx) => (
        <Dot
          key={idx}
          content={checkpointInfo}
        />
      ))}
    </ChartWrapper>
  </ChartSection>
}

const ChartSection = styled.div`
  padding: 16px;
`

const ChartWrapper = styled.div`
  background-color: #477cff;
  padding: 16px;
  border-radius: 8px;
  position: relative;
`

const Dot = styled.div<{content: CheckpointInfo}>`
  ${props => `
    // 16 = wrapper's padding; 5 = half dot size.
    --left: ${props.content.x + 16 - 5}px;
    --top: ${props.content.y + 16 - 5}px;
  `}

  position: absolute;
  left: var(--left);
  top: var(--top);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #eff2ff;
  cursor: pointer;
  box-sizing: content-box;

  &:hover {
    border: 4px solid #222;
    margin: -4px 0 0 -4px;

    &::before {
      ${props => `
        content: '${props.content.data.weight} -
          ${moment(props.content.data.date).format('ll')}';
      `}

      position: absolute;
      top: -40px;
      left: -55px;
      width: 110px;
      padding: 8px;
      z-index: 2;
      background: linear-gradient(to top, #222, #444);
      color: #ddd;
      border-radius: 4px;
      font-size: 12px;
    }
  }
`