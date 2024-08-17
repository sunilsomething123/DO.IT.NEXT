// src/designSystem/ui/SpotifySongSuggestion/index.tsx

import React from 'react'
import { Card, Typography, Button } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const { Title, Text } = Typography

type SongSuggestion = {
  mood: 'Peaceful' | 'Motivated' | 'Happy'
  albumArt: string
  songUrl: string
  songName: string
  artistName: string
}

type SpotifySongSuggestionProps = {
  suggestions: SongSuggestion[]
}

const fetchSpotifySuggestions = async (): Promise<SongSuggestion[]> => {
  const response = await axios.get('/api/spotify-suggestions')
  return response.data
}

const SpotifySongSuggestion: React.FC<SpotifySongSuggestionProps> = ({
  suggestions,
}) => {
  const { data: spotifySuggestions, isLoading } = useQuery({
    queryKey: ['spotifySuggestions'],
    queryFn: fetchSpotifySuggestions,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {spotifySuggestions?.map((suggestion, index) => (
        <Card
          key={index}
          className="relative mb-4"
          cover={<img alt={suggestion.songName} src={suggestion.albumArt} />}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-4">
            <Title level={4} className="text-center">
              Where the World Fails, Music Speaks
            </Title>
            <Text className="text-center">
              {suggestion.songName} - {suggestion.artistName}
            </Text>
            <Button
              type="primary"
              shape="circle"
              icon={<PlayCircleOutlined />}
              onClick={() => window.open(suggestion.songUrl, '_blank')}
              className="mt-4"
            />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default SpotifySongSuggestion
