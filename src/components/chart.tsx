import { useEffect, useRef } from 'react'
import { ILogEntry } from '@/types'

interface IProps {
  data: ILogEntry[]
}

export default function Chart({data}: IProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)

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

    const xStep = canvas.current.width / data.length
    const yStep = canvas.current.height / (maxValue - minValue)

    for (let i = 0; i < data.length - 1; i++) {
      const current = parseFloat(data[i].weight)
      const next = parseFloat(data[i + 1].weight)

      ctx.moveTo(i * xStep, (current - minValue) * yStep)
      ctx.lineTo((i + 1) * xStep, (next - minValue) * yStep)
    }

    ctx.stroke()
  }, [canvas])

  return <div>
    <canvas ref={canvas}/>
  </div>
}