'use client'

import { Prisma } from '@prisma/client'
import { useState, useEffect } from 'react'
import { Typography, Input, Select, Card, Row, Col, Spin, notification } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
const { Option } = Select
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/Page.layout'

export default function GetWindOfPage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [author, setAuthor] = useState<string | undefined>(undefined)

  const { data: quotes, isLoading: quotesLoading } =
    Api.quote.findMany.useQuery({
      where: {
        AND: [
          { content: { contains: searchTerm } },
          category ? { category } : {},
          author ? { author } : {},
        ],
      },
    })

  const { data: images, isLoading: imagesLoading } =
    Api.image.findMany.useQuery({})
  const { data: videos, isLoading: videosLoading } =
    Api.video.findMany.useQuery({})

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  const handleAuthorChange = (value: string) => {
    setAuthor(value)
  }

  const checkVideoAudio = (videoElement: HTMLVideoElement) => {
    const hasAudio = videoElement.mozHasAudio ||
      Boolean(videoElement.webkitAudioDecodedByteCount) ||
      Boolean(videoElement.audioTracks && videoElement.audioTracks.length)
    if (!hasAudio) {
      notification.error({
        message: 'Audio Error',
        description: 'This video does not have audio.',
      })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Inspirational Quotes</Title>
      <Paragraph>
        Browse through various inspirational quotes, images, and videos.
      </Paragraph>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Search quotes"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filter by category"
            style={{ width: '100%' }}
            onChange={handleCategoryChange}
            allowClear
          >
            <Option value="Motivation">Motivation</Option>
            <Option value="Life">Life</Option>
            <Option value="Success">Success</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Input
            placeholder="Filter by author"
            value={author}
            onChange={e => handleAuthorChange(e.target.value)}
          />
        </Col>
      </Row>

      {quotesLoading || imagesLoading || videosLoading ? (
        <Spin size="large" />
      ) : (
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {quotes?.map(quote => (
            <Card key={quote.id} style={{ minWidth: 300, marginRight: 16 }}>
              <Text>{quote.content}</Text>
              <Paragraph>- {quote.author}</Paragraph>
              <Text type="secondary">
                {dayjs(quote.datePosted).format('MMMM D, YYYY')}
              </Text>
            </Card>
          ))}
          {images?.map(image => (
            <Card
              key={image.id}
              style={{ minWidth: 300, marginRight: 16, position: 'relative' }}
              cover={<img alt={image.title} src={image.url} />}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  width: '100%',
                  color: 'white',
                  padding: 8,
                }}
              >
                <Title level={4} style={{ color: 'white' }}>
                  {image.title}
                </Title>
                <Paragraph>{image.description}</Paragraph>
              </div>
            </Card>
          ))}
          {videos?.map(video => (
            <Card
              key={video.id}
              style={{ minWidth: 300, marginRight: 16, position: 'relative' }}
              cover={
                <video
                  src={video.url}
                  autoPlay
                  loop
                  muted
                  style={{ width: '100%' }}
                  onLoadedMetadata={e => checkVideoAudio(e.currentTarget)}
                />
              }
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  width: '100%',
                  color: 'white',
                  padding: 8,
                }}
              >
                <Title level={4} style={{ color: 'white' }}>
                  {video.title}
                </Title>
                <Paragraph>{video.description}</Paragraph>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
