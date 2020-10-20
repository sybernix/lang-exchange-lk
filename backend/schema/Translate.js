import {gql} from 'apollo-server-express';

/**
 * Translate schema
 */
const TranslateSchema = gql`
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type TranslatePayload {
    translatedText: String!
    language: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets user posts by username
    getTranslation(text: String!, fromLang: String, toLang: String!): TranslatePayload
  }
`;

export default TranslateSchema;
