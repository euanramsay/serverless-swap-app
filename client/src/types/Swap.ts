export interface Swap {
  swapId: string
  createdAt: string
  description: string
  dueDate: string
  swapped: boolean
  attachmentUrl?: string
  userId: string
  offers: number
}
