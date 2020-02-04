import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateSwapRequest } from '../../requests/CreateSwapRequest'
import { createLogger } from '../../utils/logger'
import { createSwap } from '../../businessLogic/swaps'
import { getUserIdFromJwt } from '../../auth/utils'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromJwt(event)
    const { description, dueDate }: CreateSwapRequest = JSON.parse(event.body)
    logger.info('Creating swap', { description, dueDate, userId })

    const newSwap = await createSwap(description, dueDate, userId)

    logger.info('Successfully created', { newSwap })

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: newSwap })
    }
  } catch (e) {
    logger.info('Error', { error: e })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
}
