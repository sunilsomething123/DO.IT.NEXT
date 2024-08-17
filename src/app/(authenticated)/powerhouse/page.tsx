'use client'

import { useState } from 'react'
import { Typography, Calendar, Card, Row, Col, Spin, Form, Input, Button } from 'antd'
import {
  LikeOutlined,
  FileTextOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/Page.layout'

export default function PowerhousePage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const userId = user?.id

  const { data: notes, isLoading: notesLoading } = Api.note.findMany.useQuery({
    where: { userId },
  })
  const { data: savedContents, isLoading: savedContentsLoading } =
    Api.savedContent.findMany.useQuery({
      where: { userId },
      include: { content: true },
    })

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [form] = Form.useForm()

  const { mutateAsync: createNote } = Api.note.create.useMutation()

  const onDateSelect = date => {
    setSelectedDate(date)
  }

  const onFinish = async values => {
    try {
      await createNote({
        data: {
          ...values,
          date: selectedDate.format('YYYY-MM-DD'),
          userId,
        },
      })
      enqueueSnackbar('Note and goals saved successfully!', { variant: 'success' })
      form.resetFields()
    } catch (error) {
      enqueueSnackbar('Failed to save note and goals.', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Powerhouse</Title>
      <Paragraph>
        Manage your days, view saved content, and track your highs and lows.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Calendar" bordered={false}>
            <Calendar value={selectedDate} onSelect={onDateSelect} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Saved and Liked Content"
            bordered={false}
            extra={<LikeOutlined />}
          >
            {savedContentsLoading ? (
              <Spin />
            ) : (
              savedContents?.map(savedContent => (
                <Card
                  key={savedContent.id}
                  type="inner"
                  title={savedContent.content?.content}
                  extra={<FileTextOutlined />}
                >
                  <Text>{savedContent.content?.author}</Text>
                </Card>
              ))
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title="Mood Graph"
            bordered={false}
            extra={<LineChartOutlined />}
          >
            {notesLoading ? (
              <Spin />
            ) : (
              <div>
                {/* Placeholder for the graph */}
                <Text>
                  Graph showing days when you were high and low will be here.
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Add Notes and Goals" bordered={false}>
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="content"
                label="Notes"
                rules={[{ required: true, message: 'Please input your notes!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="goals"
                label="Goals"
                rules={[{ required: true, message: 'Please input your goals!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
