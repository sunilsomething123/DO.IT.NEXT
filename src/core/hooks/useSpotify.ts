// src/core/hooks/useSpotify.ts

import { useState, useEffect } from 'react'
import axios from 'axios'

type MoodCategory = 'Peaceful' | 'Motivated' | 'Happy'

type SpotifyAuth = {
  accessToken: string
  tokenType: string
  expiresIn: number
}

type SpotifyTrack = {
  id: string
  name: string
  album: {
    images: { url: string }[]
  }
  artists: { name: string }[]
  preview_url: string
}

const useSpotify = () => {
  const [auth, setAuth] = useState<SpotifyAuth | null>(null)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await axios.post('/api/spotify-auth')
        setAuth(response.data)
      } catch (err) {
        setError('Failed to authenticate with Spotify')
      }
    }

    fetchAuth()
  }, [])

  const fetchTracks = async (mood: MoodCategory) => {
    if (!auth) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get('/api/spotify-suggestions', {
        headers: {
          Authorization: `${auth.tokenType} ${auth.accessToken}`,
        },
        params: { mood },
      })
      setTracks(response.data.tracks)
    } catch (err) {
      setError('Failed to fetch tracks')
    } finally {
      setIsLoading(false)
    }
  }

  const playTrack = (trackUrl: string) => {
    const audio = new Audio(trackUrl)
    audio.play()
  }

  return {
    tracks,
    isLoading,
    error,
    fetchTracks,
    playTrack,
  }
}

export default useSpotify

// src/designSystem/ui/SpotifySongSuggestion/index.tsx

import React, { useEffect } from 'react'
import { Card, Typography, Button, Spin } from 'antd'
import useSpotify from '@/core/hooks/useSpotify'

const { Title, Text } = Typography

type SpotifySongSuggestionProps = {
  mood: 'Peaceful' | 'Motivated' | 'Happy'
}

const SpotifySongSuggestion: React.FC<SpotifySongSuggestionProps> = ({ mood }) => {
  const { tracks, isLoading, error, fetchTracks, playTrack } = useSpotify()

  useEffect(() => {
    fetchTracks(mood)
  }, [mood, fetchTracks])

  if (isLoading) {
    return <Spin />
  }

  if (error) {
    return <Text type="danger">{error}</Text>
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tracks?.map((track) => (
        <Card key={track.id} className="mb-4">
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-full h-auto"
          />
          <Title level={4}>{track.name}</Title>
          <Text>{track.artists.map((artist) => artist.name).join(', ')}</Text>
          <Button onClick={() => playTrack(track.preview_url)}>Play</Button>
        </Card>
      ))}
    </div>
  )
}

export default SpotifySongSuggestion

// src/app/api/spotify-auth/route.ts

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.error()
  }
}

// src/app/api/spotify-suggestions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mood = searchParams.get('mood')
  const token = request.headers.get('Authorization')

  const moodToPlaylist: Record<string, string> = {
    Peaceful: '37i9dQZF1DX3rxVfibe1L0',
    Motivated: '37i9dQZF1DXdxcBWuJkbcy',
    Happy: '37i9dQZF1DX3rxVfibe1L0',
  }

  const playlistId = moodToPlaylist[mood || 'Peaceful']

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: token,
        },
      }
    )

    const tracks = response.data.items.map((item: any) => item.track)

    return NextResponse.json({ tracks })
  } catch (error) {
    return NextResponse.error()
  }
}
