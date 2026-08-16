import { ILogEntry } from '@/types'
import { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import styled from 'styled-components'

interface IProps {
  data: ILogEntry[],
  onSelectMonth: (month: string) => void
}

type Mem = {
  [key: string]: { sum: number, count: number }
}

type AverageByMonth= {
  month: string,
  value: number,
  percentage?: number
}

export default function Summary({data, onSelectMonth}: IProps) {
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

    Object.keys(mem).sort().forEach(key => {
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

    if (averages.length === 1) {
      averages[0].percentage = 100
    } else {
      averages.forEach((average) => {
        average.percentage = ((average.value - minValue) * 100) / difference
      })
    }

    setAverages(averages)
  }, [data])

  useEffect(() => {
    if (!barsSection.current) return

    const {offsetWidth, scrollWidth} = barsSection.current

    if (offsetWidth && scrollWidth)
      barsSection.current.scrollTo(scrollWidth - offsetWidth, 0)
  }, [averages])

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
                type="button"
                $percentage={averageByMonth.percentage}
                aria-label={`select ${moment(averageByMonth.month).format('MMMM YYYY').toLowerCase()} monthly average`}
                onClick={() => onSelectMonth(averageByMonth.month)}
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
    background-color: #5A7BFC;
    cursor: pointer;
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

const Bar = styled.button<{$percentage: number}>`
  ${props => `
    height: calc(58px + ${props.$percentage / 2}px);
  `}

  appearance: none;
  display: block;
  background-color: #5a7bfc;
  width: 100%;
  max-width: 196px;
  border: 0;
  border-radius: 4px;
  min-width: 60px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover,
  &:focus-visible {
    background-color: #3f67f5;
  }

  &:focus-visible {
    outline: 2px solid #2146d1;
    outline-offset: 2px;
  }
`
