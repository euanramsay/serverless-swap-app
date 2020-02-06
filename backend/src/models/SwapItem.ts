export interface SwapItem {
  userId: string
  swapId: string
  createdAt: string
  description: string
  dueDate: string
  attachmentUrl?: string
  offers: Array<string>
}
