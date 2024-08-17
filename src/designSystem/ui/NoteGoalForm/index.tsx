// src/designSystem/ui/NoteGoalForm/index.tsx

import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/core/trpc'

type NoteGoalFormProps = {
  date: string
  onSuccess: () => void
}

export const NoteGoalForm: React.FC<NoteGoalFormProps> = ({
  date,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const { mutateAsync: createNote } = trpc.note.create.useMutation()

  const handleSubmit = async (values: { content: string; goals: string }) => {
    await createNote({
      date,
      content: values.content,
      goals: values.goals,
    })
    form.resetFields()
    onSuccess()
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="content"
        label="Daily Note"
        rules={[{ required: true, message: 'Please enter your daily note' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="goals"
        label="Daily Goals"
        rules={[{ required: true, message: 'Please enter your daily goals' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

// src/app/(authenticated)/powerhouse/page.tsx

import React from 'react'
import { NoteGoalForm } from '@/designSystem/ui/NoteGoalForm'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/core/trpc'
import { Typography } from 'antd'

const { Title } = Typography

const PowerhousePage: React.FC = () => {
  const { data: notes, refetch } = trpc.note.findMany.useQuery({})

  return (
    <div className="p-4">
      <Title level={2}>Powerhouse</Title>
      <NoteGoalForm
        date={new Date().toISOString().split('T')[0]}
        onSuccess={refetch}
      />
      <div className="mt-4">
        {notes?.map(note => (
          <div key={note.id} className="mb-4 p-4 border rounded">
            <Title level={4}>{note.date}</Title>
            <p>{note.content}</p>
            <p>{note.goals}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PowerhousePage
