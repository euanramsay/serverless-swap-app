import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { SwapItem } from '../models/SwapItem'
import { createLogger } from '../utils/logger'

// Using require as a workaround, I could not get this to work using import
// Also using aws-xray-sdk-core, I could not get this to work using aws-xray-sdk
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

const logger = createLogger('dataLayer')

export class SwapAccess {
  constructor (
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly swapsTable = process.env.SWAPS_TABLE,
    private readonly indexName = process.env.INDEX_NAME
  ) {}

  async createSwapData (swap: SwapItem): Promise<SwapItem> {
    logger.info('Creating', { swap })

    const putParams = {
      TableName: this.swapsTable,
      Item: swap
    }

    logger.info('Update', { putParams })

    await this.docClient.put(putParams).promise()

    return swap
  }

  async deleteSwapData (swapId: string) {
    logger.info('Deleting', { swapId })

    const deleteParams = {
      TableName: this.swapsTable,
      Key: {
        swapId
      }
    }

    logger.info('Update', { deleteParams })

    await this.docClient.delete(deleteParams).promise()
  }

  async getFeedSwapsData (userId): Promise<SwapItem[]> {
    logger.info('Scanning')

    const scanParams = {
      TableName: this.swapsTable,
      FilterExpression: 'userId <> :u',
      ExpressionAttributeValues: { ':u': userId }
    }

    logger.info('Scan', { scanParams })

    const result = await this.docClient.scan(scanParams).promise()
    const items = result.Items

    logger.info('Returning', { items })

    return items as SwapItem[]
  }

  getSignedUrlData (swapId: string) {
    logger.info('Getting signed url', { swapId })

    const s3 = new AWS.S3({ signatureVersion: 'v4' })

    const getSignedUrlParams = {
      Bucket: process.env.FILE_UPLOAD_S3_BUCKET,
      Key: swapId,
      Expires: 300
    }

    logger.info('Get signed url', { getSignedUrlParams })

    const uploadUrl = s3.getSignedUrl('putObject', getSignedUrlParams)

    return uploadUrl
  }

  async getSwapData (swapId: string): Promise<SwapItem> {
    logger.info('Getting', { swapId })

    const getParams = { TableName: this.swapsTable, Key: { swapId } }

    logger.info('Get', { getParams })

    const result = await this.docClient.get(getParams).promise()
    const item = result.Item

    logger.info('Returning', { item })

    return item as SwapItem
  }

  async getSwapsData (userId: string): Promise<SwapItem[]> {
    logger.info('Querying', { userId })

    const queryParams = {
      TableName: this.swapsTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId }
    }

    logger.info('Update', { queryParams })

    const result = await this.docClient.query(queryParams).promise()
    const items = result.Items

    logger.info('Returning', { items })

    return items as SwapItem[]
  }

  async updateSwapData (updatedItem: SwapItem) {
    logger.info('Updating', { updatedItem })

    const { swapId, offers, description } = updatedItem

    const updateExpression = offers
      ? 'set offers = :o, description = :d'
      : 'set description = :d'
    const updateParams = {
      TableName: this.swapsTable,
      Key: { swapId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ':o': offers,
        ':d': description
      }
    }

    logger.info('Update', { updateParams })

    await this.docClient.update(updateParams).promise()
  }
}
