import { SwapAccess } from '../dataLayer/swapsAccess'
import { SwapItem } from '../models/SwapItem'
import { v4 as uuid } from 'uuid'

const fileUploadS3Bucket = process.env.FILE_UPLOAD_S3_BUCKET

const swapAccess = new SwapAccess()

export async function createSwap (
  description: string,
  dueDate: string,
  userId: string
): Promise<SwapItem> {
  const swapId = uuid()
  const createdAt = new Date().toJSON()
  const attachmentUrl = `https://${fileUploadS3Bucket}.s3.us-east-1.amazonaws.com/${swapId}`
  const offers = []

  return await swapAccess.createSwapData({
    swapId,
    userId,
    createdAt,
    description,
    dueDate,
    attachmentUrl,
    offers
  })
}

export async function deleteSwap (swapId: string) {
  return swapAccess.deleteSwapData(swapId)
}

export async function getFeedSwaps (userId: string): Promise<SwapItem[]> {
  return swapAccess.getFeedSwapsData(userId)
}

export function getSignedUrl (swapId: string): string {
  return swapAccess.getSignedUrlData(swapId)
}

export async function getSwap (swapId: string): Promise<SwapItem> {
  return swapAccess.getSwapData(swapId)
}

export async function getSwaps (userId: string): Promise<SwapItem[]> {
  return swapAccess.getSwapsData(userId)
}

export async function updateSwap (updatedItem: SwapItem) {
  return swapAccess.updateSwapData(updatedItem)
}
