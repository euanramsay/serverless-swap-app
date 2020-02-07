export interface Swap {
  swapId: string
  createdAt: string
  description: string
  dueDate: string
  attachmentUrl?: string
  userId: string
  offers: Array<string>
}
