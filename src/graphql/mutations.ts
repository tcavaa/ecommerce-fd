import { gql } from '@apollo/client';

export const PLACE_ORDER_MUTATION = gql`
  mutation CreateNewOrder($orderInput: OrderInput!) {
    placeOrder(input: $orderInput)
  }
`;
