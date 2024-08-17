import React from 'react'
import { Card, Typography, List } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography

type Pattern = {
  date: string
  productivity: number
}

type Trend = {
  date: string
  selfEsteem: number
}

type Props = {
  productivityPatterns: Pattern[]
  selfEsteemTrends: Trend[]
}

export const DashboardAnalytics: React.FC<Props> = ({
  productivityPatterns,
  selfEsteemTrends,
}) => {
  const maxProductivityDay = productivityPatterns.reduce(
    (max, pattern) => (pattern.productivity > max.productivity ? pattern : max),
    productivityPatterns[0],
  )

  const maxSelfEsteemDay = selfEsteemTrends.reduce(
    (max, trend) => (trend.selfEsteem > max.selfEsteem ? trend : max),
    selfEsteemTrends[0],
  )

  return (
    <Card>
      <Title level={3}>Dashboard Analytics</Title>
      <div className="mb-4">
        <Title level={4}>Days of Maximum Productivity</Title>
        <List
          dataSource={productivityPatterns}
          renderItem={item => (
            <List.Item>
              <Text>
                {dayjs(item.date).format('YYYY-MM-DD')}:{' '}
                {item.productivity.toString()}
              </Text>
            </List.Item>
          )}
        />
        <Text strong>
          Highest Productivity:{' '}
          {dayjs(maxProductivityDay.date).format('YYYY-MM-DD')} with{' '}
          {maxProductivityDay.productivity.toString()}
        </Text>
      </div>
      <div>
        <Title level={4}>Trends in Self-Esteem</Title>
        <List
          dataSource={selfEsteemTrends}
          renderItem={item => (
            <List.Item>
              <Text>
                {dayjs(item.date).format('YYYY-MM-DD')}:{' '}
                {item.selfEsteem.toString()}
              </Text>
            </List.Item>
          )}
        />
        <Text strong>
          Highest Self-Esteem:{' '}
          {dayjs(maxSelfEsteemDay.date).format('YYYY-MM-DD')} with{' '}
          {maxSelfEsteemDay.selfEsteem.toString()}
        </Text>
      </div>
    </Card>
  )
}
