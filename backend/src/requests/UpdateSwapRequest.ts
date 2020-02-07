/**
 * Fields in a request to update a single swap item.
 */
export interface UpdateSwapRequest {
  description: string
  offers: Array<string>
}
