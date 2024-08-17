// file created

import React, { useState } from 'react'
import { Button, Form, Input, InputNumber } from 'antd'

type Props = {
  onSubmit: (selfEsteem: number, journal: string) => void
}

export const SelfWorthMonitor: React.FC<Props> = ({ onSubmit }) => {
  const [selfEsteem, setSelfEsteem] = useState<number>(0)
  const [journal, setJournal] = useState<string>('')

  const handleSubmit = () => {
    onSubmit(selfEsteem, journal)
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Self-Esteem Rating"
        rules={[
          { required: true, message: 'Please enter your self-esteem rating' },
        ]}
      >
        <InputNumber
          min={0}
          max={10}
          value={selfEsteem}
          onChange={value => setSelfEsteem(value || 0)}
          className="w-full"
        />
      </Form.Item>
      <Form.Item
        label="Journal"
        rules={[{ required: true, message: 'Please enter your journal entry' }]}
      >
        <Input.TextArea
          rows={4}
          value={journal}
          onChange={e => setJournal(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
