import { ILogEntry } from '@/types'
import { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import styled from 'styled-components'

interface IProps {
  data: ILogEntry[]
}

type Mem = {
  [key: string]: { sum: number, count: number }
}

type AverageByMonth= {
  month: string,
  value: number,
  percentage?: number
}

export default function Summary({data}: IProps) {
  const [averages, setAverages] = useState<AverageByMonth[]>([])
  const barsSection = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const averages: AverageByMonth[] = []

    const mem: Mem = {}

    data.forEach(item => {
      const key = moment(item.date).format('YYYY-MM')

      if (!mem[key]) {
        mem[key] = {
          sum: parseFloat(item.weight),
          count: 1
        }

        return
      }

      mem[key].sum += parseFloat(item.weight)
      mem[key].count++
    })

    Object.keys(mem).forEach(key => {
      averages.push({
        month: key,
        value: mem[key].sum / mem[key].count
      })
    })

    let minValue = Number.MAX_VALUE
    let maxValue = 0

    averages.forEach((average) => {
      if (average.value < minValue) minValue = average.value
      if (average.value > maxValue) maxValue = average.value
    })

    const difference = maxValue - minValue

    averages.forEach((average) => {
      average.percentage = ((average.value - minValue) * 100) / difference
    })

    setAverages(averages)

    if (!barsSection.current) return

    const {offsetWidth, scrollWidth} = barsSection.current

    if (offsetWidth && scrollWidth)
      barsSection.current?.scrollTo(scrollWidth - offsetWidth, 0)
  }, [barsSection, data])

  return (
    <div>
      <TitleText>
        monthly average
      </TitleText>

      <BarsSection
        ref={barsSection}
      >
        {averages.map((averageByMonth) => (
          <BarWrapper
            key={averageByMonth.month}
          >
            <span>
              {averageByMonth.value.toFixed(1)} kg
            </span>

            {typeof averageByMonth.percentage === 'number' && (
              <Bar
                percentage={averageByMonth.percentage}
              />
            )}

            <span>
              {moment(averageByMonth.month).format('MMM/YY').toLowerCase()}
            </span>
          </BarWrapper>
        ))}
      </BarsSection>
    </div>
  )
}

const TitleText = styled.h1`
  margin: 16px 0;
  font-size: 24px;
  line-height: 32px;
`

const BarsSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
  padding: 8px;
  background-color: #eff2ff;
  margin-top: 16px;
  overflow-x: auto;
  border-radius: 8px;
  aspect-ratio: 1.81;

  @media all and (min-width: 640px) {
    aspect-ratio: unset;
  }

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

const BarWrapper = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;

  span {
    font-weight: 700;
  }
`

const Bar = styled.div<{percentage: number}>`
  ${props => `
    height: calc(58px + ${props.percentage / 2}px);
  `}

  background-color: #5a7bfc;
  width: 100%;
  border-radius: 4px;
  min-width: 60px;
  margin: 0 auto;
  position: relative;
`