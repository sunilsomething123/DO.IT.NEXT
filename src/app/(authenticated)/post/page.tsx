'use client'

import { useState } from 'react'
import { Prisma } from '@prisma/client'
import {
  Typography,
  Input,
  Button,
  Upload,
  Form,
  Select,
  Card,
  Row,
  Col,
  Modal,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
const { Option } = Select
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/Page.layout'

export default function PostContentPage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync: createQuote } = Api.quote.create.useMutation()
  const { mutateAsync: createImage } = Api.image.create.useMutation()
  const { mutateAsync: createVideo } = Api.video.create.useMutation()
  const { mutateAsync: updateQuote } = Api.quote.update.useMutation()
  const { mutateAsync: updateImage } = Api.image.update.useMutation()
  const { mutateAsync: updateVideo } = Api.video.update.useMutation()
  const { mutateAsync: deleteQuote } = Api.quote.delete.useMutation()
  const { mutateAsync: deleteImage } = Api.image.delete.useMutation()
  const { mutateAsync: deleteVideo } = Api.video.delete.useMutation()
  const { mutateAsync: upload } = useUploadPublic()

  const [form] = Form.useForm()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    )
  }

  const handleChange = ({ fileList }: any) => setFileList(fileList)

  const handleCancel = () => setPreviewVisible(false)

  const handleSubmit = async (values: any) => {
    try {
      const { title, description, tags, type, file } = values
      let url = ''
      if (file && file.fileList.length > 0) {
        const uploadedFile = await upload({
          file: file.fileList[0].originFileObj,
        })
        url = uploadedFile.url
      }

      if (type === 'quote') {
        await createQuote({
          data: { content: title, author: user.name, userId: user.id },
        })
      } else if (type === 'image') {
        await createImage({
          data: { url, title, description, userId: user.id },
        })
      } else if (type === 'video') {
        await createVideo({
          data: { url, title, description, userId: user.id },
        })
      }

      enqueueSnackbar('Content posted successfully', { variant: 'success' })
      form.resetFields()
    } catch (error) {
      enqueueSnackbar('Failed to post content', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Post New Content</Title>
      <Paragraph>
        Share your motivational content with others by posting quotes, images,
        or videos.
      </Paragraph>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="type"
          label="Content Type"
          rules={[{ required: true, message: 'Please select content type' }]}
        >
          <Select placeholder="Select content type">
            <Option value="quote">Quote</Option>
            <Option value="image">Image</Option>
            <Option value="video">Video</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter description (optional)" />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Enter tags">
            <Option value="motivational">Motivational</Option>
            <Option value="inspirational">Inspirational</Option>
          </Select>
        </Form.Item>
        <Form.Item name="file" label="Upload">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Post
        </Button>
      </Form>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageLayout>
  )
}
