import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { getSwap, updateSwap } from '../../businessLogic/swaps'

import { UpdateSwapRequest } from '../../requests/UpdateSwapRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { swapId } = event.pathParameters

  logger.info(`Updating swap ${swapId}`)

  const updatedItem: UpdateSwapRequest = JSON.parse(event.body)

  try {
    logger.info('Getting swap', { swapId })

    const Item = await getSwap(swapId)

    logger.info('Successfully returned', { Item })

    const updatedSwap = { ...Item, ...updatedItem }

    logger.info('Updating', { updatedSwap })

    await updateSwap(updatedSwap)

    logger.info('Successfully updated', { updatedSwap })

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  } catch (e) {
    logger.info(`Error ${e}`)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
}
