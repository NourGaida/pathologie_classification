import axios from 'axios'

const getBaseUrl = () => {
  const stored = localStorage.getItem('chestvision_api_url')
  return stored || import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

export const api = axios.create({
  timeout: 120000,
})

api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl()
  return config
})

export const predictImage = async (file, metadata = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  if (metadata.age != null) formData.append('age', String(metadata.age))
  if (metadata.sex) formData.append('sex', metadata.sex)
  if (metadata.projection) formData.append('projection', metadata.projection)
  const { data } = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const fetchHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

export const fetchGradcam = async (file, targetDisease = null) => {
  const formData = new FormData()
  formData.append('file', file)
  if (targetDisease) formData.append('target_disease', targetDisease)
  const { data } = await api.post('/gradcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
