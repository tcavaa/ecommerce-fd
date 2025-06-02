import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`query ($category: String!){
  products 
  (category: $category){
    id
    gallery
    name
    inStock
    description
    category
    brand
    __typename
    prices {
      amount
      __typename
      currency {
        label
        symbol
        __typename
      }
    }
    attributes {
      id
      name
      type
      __typename
      items {
        id
        value
        displayValue
        __typename
      }
    }
  }
}`;

export const GET_PRODUCT = gql`query ($id: String!){
  product
  (id: $id){
    id
    gallery
    name
    inStock
    description
    category
    brand
    __typename
    prices {
      amount
      __typename
      currency {
        label
        symbol
        __typename
      }
    }
    attributes {
      id
      type
      name
      __typename
      items {
        id
        value
        displayValue
        __typename
      }
    }
  }
}`;

export const GET_CATS = gql`
  query GetCats {
    categories {
      name
      __typename
    }
  }
`;
