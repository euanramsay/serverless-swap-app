/**
 * Fields in a request to update a single SWAP item.
 */
export interface UpdateSwapRequest {
  description: string
  dueDate: string
  swapped: boolean
}
