import { ILogEntry } from '@/types'
import { useEffect, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'

interface IProps {
  data: ILogEntry[]
}

type AverageByMonth= {
  month: string,
  value: number,
  percentage?: number
}

export default function Summary({data}: IProps) {
  const [averages, setAverages] = useState<AverageByMonth[]>([])

  useEffect(() => {
    const averages: AverageByMonth[] = []

    let currentSum = parseFloat(data[0].weight)
    let currentCount = 1

    for (let i = 1; i < data.length; i++) {
      const yesterdaysMonth = moment(data[i - 1].date).format('MM/YYYY')
      const todaysMonth = moment(data[i].date).format('MM/YYYY')

      if (i === data.length - 1) {
        ++currentCount
        currentSum += parseFloat(data[i].weight)
        averages.push({
          month: data[i].date,
          value: currentSum / currentCount
        })
        continue
      }

      if (yesterdaysMonth !== todaysMonth) {
        averages.push({
          month: data[i - 1].date,
          value: currentSum / currentCount
        })

        currentCount = 1
        currentSum = parseFloat(data[i].weight)
        continue
      }

      ++currentCount
      currentSum += parseFloat(data[i].weight)
    }

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
  }, [data])

  return (
    <div>
      <TitleText>
        monthly average
      </TitleText>

      <BarsSection>
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
`

const Bar = styled.div<{percentage: number}>`
  ${props => `
    height: calc(16px + ${props.percentage}px);
  `}

  background-color: #5a7bfc;
  width: 100%;
  border-radius: 4px;
  min-width: 60px;
  margin: 0 auto;
  position: relative;
`