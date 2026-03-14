import { useState, useCallback, useRef } from 'react'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface UseFileUploadOptions {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  onUpload?: (file: File) => Promise<string>
  onError?: (error: string) => void
}

export interface UseFileUploadReturn {
  files: UploadedFile[]
  isUploading: boolean
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  openFilePicker: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  getAcceptedTypesString: () => string
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024
const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

function generateId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function createFilePreview(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(undefined)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = () => {
      resolve(undefined)
    }
    reader.readAsDataURL(file)
  })
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = 10,
    maxSize = DEFAULT_MAX_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    onUpload,
    onError,
  } = options

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `Arquivo "${file.name}" excede o tamanho máximo de ${formatFileSize(maxSize)}`
      }

      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        return `Tipo de arquivo "${file.type}" não é permitido`
      }

      return null
    },
    [maxSize, acceptedTypes]
  )

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList)

      if (files.length + newFiles.length > maxFiles) {
        onError?.(`Máximo de ${maxFiles} arquivos permitidos`)
        return
      }

      const processedFiles: UploadedFile[] = []

      for (const file of newFiles) {
        const error = validateFile(file)

        if (error) {
          onError?.(error)
          continue
        }

        const preview = await createFilePreview(file)

        const uploadedFile: UploadedFile = {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          progress: 0,
          status: 'pending',
        }

        processedFiles.push(uploadedFile)
      }

      if (processedFiles.length === 0) return

      setFiles((prev) => [...prev, ...processedFiles])

      if (onUpload) {
        setIsUploading(true)

        for (const uploadedFile of processedFiles) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: 'uploading', progress: 0 }
                : f
            )
          )

          try {
            await onUpload(uploadedFile.file)

            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? { ...f, status: 'completed', progress: 100 }
                  : f
              )
            )
          } catch (err) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? {
                      ...f,
                      status: 'error',
                      error: err instanceof Error ? err.message : 'Upload falhou',
                    }
                  : f
              )
            )
          }
        }

        setIsUploading(false)
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            processedFiles.some((pf) => pf.id === f.id)
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        )
      }
    },
    [files.length, maxFiles, validateFile, onUpload, onError]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      return []
    })
  }, [])

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const getAcceptedTypesString = useCallback(() => {
    return acceptedTypes.join(',')
  }, [acceptedTypes])

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    openFilePicker,
    inputRef,
    getAcceptedTypesString,
  }
}

export { formatFileSize }
