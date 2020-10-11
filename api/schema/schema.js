import {gql} from 'apollo-server-express';

import UserSchema from './User';
import PostSchema from './Post';
import MessageSchema from './Message';
import LikeSchema from './Like';
import FollowSchema from './Follow';
import CommentSchema from './Comment';
import NotificationSchema from './Notification';
import TranslateSchema from './Translate';

const schema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  ${UserSchema}
  ${PostSchema}
  ${MessageSchema}
  ${FollowSchema}
  ${LikeSchema}
  ${CommentSchema}
  ${NotificationSchema}
  ${TranslateSchema}
`;

export default schema;
