import Axios from 'axios'
import { CreateSwapRequest } from '../types/CreateSwapRequest'
import { Swap } from '../types/Swap'
import { UpdateSwapRequest } from '../types/UpdateSwapRequest'
import { apiEndpoint } from '../config'

export async function getSwaps(idToken: string): Promise<Swap[]> {
  console.log('Fetching swaps')

  const response = await Axios.get(`${apiEndpoint}/swaps`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Swaps:', response.data)
  return response.data.items
}

export async function getAllSwaps(idToken: string): Promise<Swap[]> {
  console.log('Fetching swaps')

  const response = await Axios.get(`${apiEndpoint}/swaps/all`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Swaps:', response.data)
  return response.data.items
}

export async function createSwap(
  idToken: string,
  newSwap: CreateSwapRequest
): Promise<Swap> {
  const response = await Axios.post(
    `${apiEndpoint}/swaps`,
    JSON.stringify(newSwap),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchSwap(
  idToken: string,
  swapId: string,
  updatedSwap: UpdateSwapRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/swaps/${swapId}`,
    JSON.stringify(updatedSwap),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteSwap(
  idToken: string,
  swapId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/swaps/${swapId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  swapId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/swaps/${swapId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
