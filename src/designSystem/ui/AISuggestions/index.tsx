import React from 'react'
import { Card, Typography } from 'antd'
import { Api } from '@/core/trpc'
import { useQuery } from '@tanstack/react-query'

const { Title, Text, Paragraph } = Typography

type Suggestion = {
  type: 'image' | 'video' | 'quote'
  content: string
  author?: string
  url?: string
}

type AISuggestionsProps = {
  suggestions: Suggestion[]
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions }) => {
  const { data: aiSuggestions, isLoading } = useQuery({
    queryKey: ['aiSuggestions'],
    queryFn: async () => {
      const goals = 'user goals' // Replace with actual user goals
      const preferences = 'user preferences' // Replace with actual user preferences
      const response = await Api.ai.generateText.useMutation().mutateAsync({
        prompt: `Based on the following goals: ${goals} and preferences: ${preferences}, recommend pertinent images, videos, and quotes.`,
      })
      return response.answer
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suggestions?.map((suggestion, index) => (
        <Card key={index} className="mb-4">
          {suggestion.type === 'image' && (
            <>
              <img
                src={suggestion.url}
                alt={suggestion.content}
                className="w-full h-auto"
              />
              <Title level={4}>{suggestion.content}</Title>
            </>
          )}
          {suggestion.type === 'video' && (
            <>
              <video controls className="w-full h-auto">
                <source src={suggestion.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Title level={4}>{suggestion.content}</Title>
            </>
          )}
          {suggestion.type === 'quote' && (
            <>
              <Paragraph>"{suggestion.content}"</Paragraph>
              {suggestion.author && <Text>- {suggestion.author}</Text>}
            </>
          )}
        </Card>
      ))}
    </div>
  )
}

export default AISuggestions
