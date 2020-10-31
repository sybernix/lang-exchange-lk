import gql from 'graphql-tag';

/**
 * Creates a following between two users
 */
export const CREATE_FOLLOW = gql`
  mutation($input: CreateFollowInput!) {
    createFollow(input: $input) {
      id
    }
  }
`;

/**
 * deletes a following
 */
export const DELETE_FOLLOW = gql`
  mutation($input: DeleteFollowInput!) {
    deleteFollow(input: $input) {
      id
    }
  }
`;

/**
 * Gets list of users who follow the userId
 */
export const GET_FOLLOWERS = gql`
  query($username: String!, $skip: Int, $limit: Int) {
    getFollowers(username: $username, skip: $skip, limit: $limit) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Gets list of users followed by the userId
 */
export const GET_USERS_FOLLOWED_BY_USER = gql`
  query($username: String!, $skip: Int, $limit: Int) {
    getUsersFollowedByUser(username: $username, skip: $skip, limit: $limit) {
      id
      fullName
      username
      image
    }
  }
`;
