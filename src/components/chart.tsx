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

type NewMonthInfo = {
  x: number,
  month: string
}

export default function Chart({data}: IProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const chartWrapper = useRef<HTMLDivElement | null>(null)
  const [checkpointsInfo, setCheckpointsInfo] = useState<CheckpointInfo[]>([])
  const [newMonthsInfo, setNewMonthsInfo] = useState<NewMonthInfo[]>([])
  const [selectedDot, setSelectedDot] = useState<number>(data.length - 1)

  useEffect(() => {
    if (!chartWrapper.current) return

    const {offsetWidth, scrollWidth} = chartWrapper.current

    if (offsetWidth && scrollWidth)
      chartWrapper.current?.scrollTo(scrollWidth - offsetWidth, 0)
  }, [chartWrapper, checkpointsInfo])

  useEffect(() => {
    if (!canvas.current) return

    const xStep = 20

    canvas.current.width = (data.length - 1) * xStep
    canvas.current.height = 148

    const ctx = canvas.current.getContext('2d')
    if (!ctx) return

    let minValue = Number.MAX_VALUE
    let maxValue = 0

    data.forEach(value => {
      const parsed = parseFloat(value.weight)

      if (parsed < minValue) minValue = parsed
      if (parsed > maxValue) maxValue = parsed
    })

    const yStep = (canvas.current.height - 3 - 20) / (maxValue - minValue)
    const checkpointsInfo = []
    const newMonthsInfo = []
    const newWeeks = []

    data.sort((a, b) => a.date < b.date ? -1 : 1)

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

      const todaysMonth = moment(data[i].date).format('M')
      const tomorrowsMonth = moment(data[i + 1].date).format('M')

      if (i < data.length - 2 && todaysMonth !== tomorrowsMonth)
        newMonthsInfo.push({
          x: x2,
          month: moment(data[i + 1].date).format('MMM')
        })

      const todaysWeekday = moment(data[i].date).format('d')
      if (todaysWeekday === '0') newWeeks.push(x1)
    }

    setCheckpointsInfo(checkpointsInfo)
    setNewMonthsInfo(newMonthsInfo)

    ctx.lineWidth = 3
    ctx.strokeStyle = '#eff2ff'
    ctx.stroke()

    newMonthsInfo.forEach(info => {
      if (!canvas.current) return

      ctx.moveTo(info.x, 0)
      ctx.lineTo(info.x, canvas.current.height)
    })

    ctx.setLineDash([4, 4])
    ctx.stroke()

    newWeeks.forEach(x => {
      if (!canvas.current) return

      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.current.height)
    })

    ctx.lineWidth = 1
    ctx.stroke()
  }, [canvas, data])

  const onSelectDot = (e: React.SyntheticEvent) => {
    if (!(e.target instanceof HTMLDivElement)) return

    if (e.target.dataset.value)
      setSelectedDot(parseInt(e.target.dataset.value))
  }

  return <ChartSection>
    <ChartWrapper
      ref={chartWrapper}
    >
      <canvas
        ref={canvas}
      />

      {checkpointsInfo.map((checkpointInfo, idx) => (
        <Dot
          className={`${idx === selectedDot ? '-is-selected' : ''}`}
          key={idx}
          content={checkpointInfo}
          onClick={onSelectDot}
          data-value={idx}
        />
      ))}

      {newMonthsInfo.map((newMonthInfo, idx) => (
        <NewMonthText
          key={idx}
          x={newMonthInfo.x}
        >
          {newMonthInfo.month}
        </NewMonthText>
      ))}
    </ChartWrapper>
  </ChartSection>
}

const ChartSection = styled.div`
  padding: 16px 0;
  width: 100%;
`

const ChartWrapper = styled.div`
  background-color: #477cff;
  padding: 50px 74px;
  border-radius: 8px;
  position: relative;
  width: 100%;
  max-width: 1280px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: .6rem;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    outline: none;
  }
`

const Dot = styled.div<{content: CheckpointInfo}>`
  ${props => `
    --left: ${props.content.x + 74 - 5}px;
    --top: ${props.content.y + 50 - 5}px;
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

  &:hover,
  &.-is-selected {
    border: 4px solid #222;
    margin: -4px 0 0 -4px;
  }

  &.-is-selected {
    &::before {
      ${props => `
        content: '${props.content.data.weight} -
          ${moment(props.content.data.date).format('ll')}';
      `}

      position: absolute;
      white-space: nowrap;
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

const NewMonthText = styled.div<{x: number}>`
  ${props => `left: ${props.x + 74}px;`}

  position: absolute;
  font-size: 16px;
  color: #eff2ff;
  bottom: 52px;
  margin-left: 8px;
`