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
  getFeedSwaps,
  getSwaps,
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
  feed: Swap[]
  newSwapDescription: string
  loadingSwaps: boolean
}

export class Swaps extends React.PureComponent<SwapsProps, SwapsState> {
  state: SwapsState = {
    swaps: [],
    feed: [],
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
      this.forceUpdate()
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
      const { swapId, description, offers } = this.state.feed[pos]
      const jwtToken: string = this.props.auth.getIdToken()
      const userId: string = decode(jwtToken)!.sub
      const removeUserId = (userId: string, offers: Array<string>) => {
        const index = offers.indexOf(userId)
        if (index > -1) {
          offers.splice(index, 1)
        }
      }
      offers.includes(userId)
        ? removeUserId(userId, offers)
        : offers.push(userId)

      this.setState({
        feed: update(this.state.feed, {
          [pos]: {
            offers: { $set: offers }
          }
        })
      })
      this.forceUpdate()

      await patchSwap(this.props.auth.getIdToken(), swapId, {
        description,
        offers
      })
    } catch {
      alert('Swap deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const idToken = this.props.auth.getIdToken()
      const swaps = await getSwaps(idToken)
      const feed = await getFeedSwaps(idToken)

      this.setState({
        swaps,
        feed,
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
      <Grid columns={2} relaxed="very" stackable>
        <Grid.Column>
          <Header as="h2">Swap feed</Header>
          {this.state.feed.map((feedSwap, pos) => {
            return (
              <Card key={pos}>
                <Image src={feedSwap.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{feedSwap.description}</Card.Header>
                  <Card.Meta>
                    <span className="date">{`Posted: ${dateFormat(
                      feedSwap.createdAt,
                      'dd-mm-yyyy'
                    )}`}</span>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    icon
                    color={feedSwap.offers.includes(userId) ? 'red' : 'green'}
                    onClick={() => this.onSwapButtonClick(pos)}
                  >
                    <Icon
                      name={
                        feedSwap.offers.includes(userId)
                          ? 'handshake'
                          : 'hand paper'
                      }
                    />
                  </Button>
                </Card.Content>
              </Card>
            )
          })}
        </Grid.Column>
        <Grid.Column>
          <Header as="h2">My swaps</Header>
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

              {swap.offers.length > 0 && (
                <Step.Group>
                  <Step>
                    <Icon name="handshake" />
                    <Step.Content>
                      <Step.Title>You got swapped!</Step.Title>
                      {swap.offers.length > 1 ? (
                        <Step.Description>
                          {`${swap.offers.length} people want to swap`}
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
            </Card>
          ))}
        </Grid.Column>
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
