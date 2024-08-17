import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * @provider UploadHooks
 * @description An Upload hooks to upload one file
 * @function {({options: {file: File}) => Promise<{url: string, hasAudio: boolean}>} upload - Hook to upload the File to the server and return the url of the uploaded file and whether it has audio so you can then store it
 * @usage `const {mutateAsync: upload} = useUploadPublic(); await upload({file});`
 * @import import { useUploadPublic } from '@/core/hooks/upload'
 */

type Options = { file: File }

const checkIfVideoHasAudio = async (file: File): Promise<boolean> => {
  const formData = new FormData()
  formData.append('file', file, file.name)

  const response = await axios.post<{ hasAudio: boolean }>(
    '/api/video/check-audio',
    formData,
  )

  return response.data.hasAudio
}

export const useUploadPrivate = () =>
  useMutation({
    mutationFn: async ({
      file,
    }: Options): Promise<{ url: string; hasAudio: boolean }> => {
      try {
        const formData = new FormData()
        formData.append('file', file, file.name)

        const response = await axios.post<{ url: string }>(
          '/api/upload/private',
          formData,
        )

        const hasAudio = await checkIfVideoHasAudio(file)

        return { ...response.data, hasAudio }
      } catch (error) {
        throw new Error('Failed to upload file')
      }
    },
  })

export const useUploadPublic = () =>
  useMutation({
    mutationFn: async ({
      file,
    }: Options): Promise<{ url: string; hasAudio: boolean }> => {
      try {
        const formData = new FormData()
        formData.append('file', file, file.name)

        const response = await axios.post<{ url: string }>(
          '/api/upload/public',
          formData,
        )

        const hasAudio = await checkIfVideoHasAudio(file)

        return { ...response.data, hasAudio }
      } catch (error) {
        throw new Error('Failed to upload file')
      }
    },
  })
