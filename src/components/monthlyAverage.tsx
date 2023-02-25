import { ILogEntry } from '@/types'
import { useEffect, useState } from 'react'
import moment from 'moment'

interface IProps {
  data: ILogEntry[]
}

type AverageByMonth= {
  month: string,
  average: number
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
        averages.push({ month: data[i - 1].date, average: currentSum / currentCount })
        continue
      }

      if (yesterdaysMonth !== todaysMonth) {
        averages.push({ month: data[i - 1].date, average: currentSum / currentCount })
        currentSum = parseFloat(data[i].weight)
        currentCount = 1
        continue
      }

      currentSum += parseFloat(data[i].weight)
      currentCount++
    }

    setAverages(averages)
  }, [data])

  return <div>
    <h1>montly average:</h1>

    {averages.map((averageByMonth) => (
      <div key={averageByMonth.month}>
        <b>{moment(averageByMonth.month).format('MMM/YY')}:</b> {averageByMonth.average.toFixed(1)} kg
      </div>
    ))}
  </div>
}