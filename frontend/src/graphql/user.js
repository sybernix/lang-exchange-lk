import gql from 'graphql-tag';
import {
    postCommentsPayload,
    postAuthorPayload,
    postLikesPayload,
} from './post';

/**
 * Records to select from user
 */
const userPayload = `
  id
  username
  email
  fullName
  image
  imagePublicId
  coverImage
  coverImagePublicId
  createdAt
`;

/**
 * Gets specific user by username
 */
export const GET_USER = gql`
  query($username: String, $id: ID) {
    getUser(username: $username, id: $id) {
      ${userPayload}
      isOnline
      nativeLanguage
      targetLanguage
      introduction
      dateOfBirth
      sex
      city
      posts {
        id
      }
      following {
        id
      }
      followers {
        id
      }
      notifications {
        id
        author {
          id
          username
        }
        follow {
          id
        }
        like {
          id
        }
        comment {
          id
        }
      }
    }
  }
`;

/**
 * Gets user posts
 */
export const GET_USER_POSTS = gql`
  query($username: String!, $skip: Int, $limit: Int) {
    getUserPosts(username: $username, skip: $skip, limit: $limit) {
      count
      posts {
        id
        title
        image
        imagePublicId
        createdAt
        ${postAuthorPayload}
        ${postCommentsPayload}
        ${postLikesPayload}
      }
    }
  }
`;

/**
 * Gets authenticated user
 */
export const GET_AUTH_USER = gql`
  query {
    getAuthUser {
      ${userPayload}
      nativeLanguage
      targetLanguage
      newNotifications {
        id
        createdAt
        author {
          id
          fullName
          username
          image
        }
        follow {
          id
        }
        comment {
          id
          post {
            id
            image
          }
        }
        like {
          id
          post {
            id
            image
          }
        }
      }
      newConversations {
        id
        username
        fullName
        image
        lastMessage
        lastMessageCreatedAt
      }
      likes {
        id
        user
        post
      }
      posts {
        id
      }
      following {
        id
        user
      }
      followers {
        id
      }
    }
  }
`;

/**
 * Adds introduction text
 */
export const ADD_INTRODUCTION = gql`
  mutation($input: addIntroductionInput!) {
    addIntroduction(input: $input) {
      message
    }
  }
`;

/**
 * Updates account information
 */
export const UPDATE_ACCOUNT_INFO = gql`
  mutation($input: UpdateInfoInput!) {
    updateAccountInfo(input: $input) {
      message
    }
  }
`;

/**
 * Gets all available users
 */
export const GET_USERS = gql`
  query($userId: String!, $skip: Int, $limit: Int) {
    getUsers(userId: $userId, skip: $skip, limit: $limit) {
      count
      users {
        id
        fullName
        username
        image
        following {
          id
          user
        }
        followers {
          id
        }
        notifications {
          id
          author {
            id
            username
          }
          follow {
            id
          }
        }
      }
    }
  }
`;

/**
 * Gets potential language partners
 */
export const GET_POTENTIAL_PARTNERS = gql`
  query($userId: String!, $city: String, $sex: String, $age: String, $skip: Int, $limit: Int) {
    getPotentialPartners(userId: $userId, city: $city, sex: $sex, age: $age, skip: $skip, limit: $limit) {
      count
      users {
        id
        fullName
        username
        image
        nativeLanguage
        targetLanguage
        dateOfBirth
        sex
        city
        following {
          id
          user
        }
        followers {
          id
        }
        notifications {
          id
          author {
            id
            username
          }
          follow {
            id
          }
        }
      }
    }
  }
`;

/**
 * Searches users by username or fullName
 */
export const SEARCH_USERS = gql`
  query($searchQuery: String!) {
    searchUsers(searchQuery: $searchQuery) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Uploads user photo
 */
export const UPLOAD_PHOTO = gql`
  mutation($input: UploadUserPhotoInput!) {
    uploadUserPhoto(input: $input) {
      id
    }
  }
`;

/**
 * Sign up user
 */
export const SIGN_UP = gql`
  mutation($input: SignUpInput!) {
    signup(input: $input) {
      token
    }
  }
`;

/**
 * Sign in user
 */
export const SIGN_IN = gql`
  mutation($input: SignInInput!) {
    signin(input: $input) {
      token
      authUserId
      authUserEmail
    }
  }
`;

/**
 * Request reset password
 */
export const REQUEST_PASSWORD_RESET = gql`
  mutation($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      message
    }
  }
`;

/**
 * Verify reset password token
 */
export const VERIFY_RESET_PASSWORD_TOKEN = gql`
  query($email: String!, $token: String!) {
    verifyResetPasswordToken(email: $email, token: $token) {
      message
    }
  }
`;

/**
 * Reset password
 */
export const RESET_PASSWORD = gql`
  mutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      token
    }
  }
`;

/**
 * Learners suggestions for auth user
 */
export const USER_SUGGESTIONS = gql`
  query($userId: String!) {
    suggestLearners(userId: $userId) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Gets list of forum users who are learning the same language as user
 */
export const GET_FORUM_USERS = gql`
  query($userId: String!) {
    getForumUsers(userId: $userId) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Learners suggestions for auth user
 */
export const USER_SUGGESTIONS_WITH_SCORE = gql`
  query($userId: String!) {
    suggestLearnersWithScore(userId: $userId) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Get users with whom authUser had a conversation
 */
export const GET_CONVERSATIONS = gql`
  query($authUserId: ID!) {
    getConversations(authUserId: $authUserId) {
      id
      username
      fullName
      image
      isOnline
      seen
      lastMessage
      lastMessageSender
      lastMessageCreatedAt
    }
  }
`;

/**
 * Checks if user is online in real time
 */
export const IS_USER_ONLINE_SUBSCRIPTION = gql`
  subscription($authUserId: ID!, $userId: ID!) {
    isUserOnline(authUserId: $authUserId, userId: $userId) {
      userId
      isOnline
    }
  }
`;
