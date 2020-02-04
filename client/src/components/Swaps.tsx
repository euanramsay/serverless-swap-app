import * as React from 'react'

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Loader
} from 'semantic-ui-react'
import { createSwap, deleteSwap, getSwaps, patchSwap } from '../api/swaps-api'

import Auth from '../auth/Auth'
import { History } from 'history'
import { Swap } from '../types/Swap'
import dateFormat from 'dateformat'
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

  onSwapCheck = async (pos: number) => {
    try {
      const swap = this.state.swaps[pos]
      await patchSwap(this.props.auth.getIdToken(), swap.swapId, {
        description: swap.description,
        dueDate: swap.dueDate,
        swapped: !swap.swapped
      })
      this.setState({
        swaps: update(this.state.swaps, {
          [pos]: { swapped: { $set: !swap.swapped } }
        })
      })
    } catch {
      alert('Swap deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const swaps = await getSwaps(this.props.auth.getIdToken())
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
        <Header as="h1">Swap App</Header>

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
            placeholder="To change the world..."
            onChange={this.handleDescriptionChange}
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
    return (
      <Grid padded>
        {this.state.swaps.map((swap, pos) => {
          return (
            <Grid.Row key={swap.swapId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onSwapCheck(pos)}
                  checked={swap.swapped}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {swap.description}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {swap.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(swap.swapId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onSwapDelete(swap.swapId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {swap.attachmentUrl && (
                <Image src={swap.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
