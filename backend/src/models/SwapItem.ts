export interface SwapItem {
  userId: string
  swapId: string
  createdAt: string
  description: string
  dueDate: string
  swapped: boolean
  attachmentUrl?: string
  offers: number
}
