'use client'

import { Typography, Row, Col, Card, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/Page.layout'

export default function HomePage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const { data: quotes, isLoading: quotesLoading } =
    Api.quote.findMany.useQuery({
      include: { user: true },
    })

  const { data: recommendedQuotes, isLoading: recommendedLoading } =
    Api.quote.findMany.useQuery({
      where: { category: 'recommended' },
      include: { user: true },
    })

  const handleSearch = (value: string) => {
    router.push(`/Discover-content?search=${value}`)
  }

  const handleRedirect = () => {
    router.push('/powerhouse')
  }

  return (
    <PageLayout layout="narrow">
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <img
          src="https://img.freepik.com/free-photo/illustration-anime-character-rain_23-2151394670.jpg"
          alt="Happiness is not a chance, its a choice"
          style={{ width: '100%', height: 'auto', opacity: 0.5 }}
        />
        <Title
          level={1}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            whiteSpace: 'normal',
            textAlign: 'center',
          }}
        >
          Happiness is not a chance, it's a choice
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={1} style={{ textAlign: 'left' }}>
            You don't have to be great to start, but you have to start to be
            great
          </Title>
          <Paragraph>
            Improve yourself by our website and redirect to the built Powerhouse
            page where users can make notes of their day to improve themselves.
          </Paragraph>
          <Button type="primary" onClick={handleRedirect} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Go to Powerhouse
          </Button>
          <img
            src="https://wallpapersmug.com/download/3840x2400/fed51a/Ken-Kaneki-anime-dark.jpg"
            alt="Motivating Quote Background"
            style={{ width: '100%', height: 'auto', opacity: 0.5 }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
        <Col span={24}>
          <Input
            size="large"
            placeholder="Discover quotes..."
            prefix={<SearchOutlined />}
            onPressEnter={e =>
              handleSearch((e.target as HTMLInputElement).value)
            }
          />
          <Title level={2} style={{ marginTop: '1rem' }}>
            No man ever made a great discovery without the exercise of the
            imagination.
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
        <Col span={24}>
          <Title level={2}>Famous Quotes</Title>
          {quotesLoading ? (
            <Text>Loading...</Text>
          ) : (
            quotes?.map(quote => (
              <Card
                key={quote.id}
                title={quote.user?.name}
                style={{ marginBottom: '1rem' }}
              >
                <Paragraph>{quote.content}</Paragraph>
              </Card>
            ))
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
        <Col span={24}>
          <Title level={2}>Recommended Quotes</Title>
          {recommendedLoading ? (
            <Text>Loading...</Text>
          ) : (
            recommendedQuotes?.map(quote => (
              <Card
                key={quote.id}
                title={quote.user?.name}
                style={{ marginBottom: '1rem' }}
              >
                <Paragraph>{quote.content}</Paragraph>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </PageLayout>
  )
}
