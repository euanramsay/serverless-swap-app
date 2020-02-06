import * as React from 'react'

import {
  Button,
  Card,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Loader,
  Step
} from 'semantic-ui-react'
import {
  createSwap,
  deleteSwap,
  getAllSwaps,
  patchSwap
} from '../api/swaps-api'

import Auth from '../auth/Auth'
import { History } from 'history'
import { Swap } from '../types/Swap'
import dateFormat from 'dateformat'
import { decode } from 'jsonwebtoken'
import update from 'immutability-helper'

interface SwapsProps {
  auth: Auth
  history: History
}

interface SwapsState {
  swaps: Swap[]
  newSwapDescription: string
  loadingSwaps: boolean
}

export class Swaps extends React.PureComponent<SwapsProps, SwapsState> {
  state: SwapsState = {
    swaps: [],
    newSwapDescription: '',
    loadingSwaps: true
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSwapDescription: event.target.value })
  }

  onEditButtonClick = (swapId: string) => {
    this.props.history.push(`/swaps/${swapId}/edit`)
  }

  onSwapCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newSwap = await createSwap(this.props.auth.getIdToken(), {
        description: this.state.newSwapDescription,
        dueDate
      })
      this.setState({
        swaps: [...this.state.swaps, newSwap],
        newSwapDescription: ''
      })
    } catch {
      alert('Swap creation failed')
    }
  }

  onSwapDelete = async (swapId: string) => {
    try {
      await deleteSwap(this.props.auth.getIdToken(), swapId)
      this.setState({
        swaps: this.state.swaps.filter(swap => swap.swapId != swapId)
      })
    } catch {
      alert('Swap deletion failed')
    }
  }

  onSwapButtonClick = async (pos: number) => {
    try {
      const swap = this.state.swaps[pos]
      await patchSwap(this.props.auth.getIdToken(), swap.swapId, {
        description: swap.description,
        offers: swap.offers + 1,
        swapped: !swap.swapped
      })
      this.setState({
        swaps: update(this.state.swaps, {
          [pos]: {
            swapped: { $set: !swap.swapped },
            offers: { $set: swap.offers + 1 }
          }
        })
      })
    } catch {
      alert('Swap deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const swaps = await getAllSwaps(this.props.auth.getIdToken())
      this.setState({
        swaps,
        loadingSwaps: false
      })
    } catch (e) {
      alert(`Failed to fetch swaps: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">
          Swapped! <Icon name={'sync alternate'} />
        </Header>

        {this.renderCreateSwapInput()}

        {this.renderSwaps()}
      </div>
    )
  }

  renderCreateSwapInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New swap',
              onClick: this.onSwapCreate
            }}
            fluid
            actionPosition="left"
            onChange={this.handleDescriptionChange}
            size="big"
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderSwaps() {
    if (this.state.loadingSwaps) {
      return this.renderLoading()
    }

    return this.renderSwapsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading swaps
        </Loader>
      </Grid.Row>
    )
  }

  renderSwapsList() {
    const jwtToken: string = this.props.auth.getIdToken()
    const userId: string = decode(jwtToken)!.sub
    return (
      <Grid>
        {this.state.swaps.map((swap, pos) => (
          <Card key={pos}>
            <Image src={swap.attachmentUrl} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{swap.description}</Card.Header>
              <Card.Meta>
                <span className="date">{`Posted: ${dateFormat(
                  swap.createdAt,
                  'dd-mm-yyyy'
                )}`}</span>
              </Card.Meta>
            </Card.Content>
            {userId === swap.userId && (
              <>
                {swap.offers > 0 && (
                  <Step.Group>
                    <Step>
                      <Icon name="handshake" />
                      <Step.Content>
                        <Step.Title>You got swapped!</Step.Title>
                        {swap.offers > 1 ? (
                          <Step.Description>
                            {`${swap.offers} people want to swap`}
                          </Step.Description>
                        ) : (
                          <Step.Description>
                            {'1 person wants to swap'}
                          </Step.Description>
                        )}
                      </Step.Content>
                    </Step>
                  </Step.Group>
                )}
                <Card.Content extra>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(swap.swapId)}
                  >
                    <Icon name="upload" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onSwapDelete(swap.swapId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Card.Content>
              </>
            )}
            {userId !== swap.userId && (
              <Card.Content extra>
                <Button
                  icon
                  color={swap.swapped ? 'red' : 'green'}
                  onClick={() => this.onSwapButtonClick(pos)}
                >
                  <Icon name={swap.swapped ? 'handshake' : 'hand paper'} />
                </Button>
              </Card.Content>
            )}
          </Card>
        ))}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
