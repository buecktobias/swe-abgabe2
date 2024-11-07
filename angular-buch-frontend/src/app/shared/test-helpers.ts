import { GraphQLError } from 'graphql';

export function createGraphQLError(
  message: string,
  code = 'INTERNAL_SERVER_ERROR',
  additionalFields?: Partial<GraphQLError>,
): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code },
    path: additionalFields?.path,
    nodes: additionalFields?.nodes,
    source: additionalFields?.source,
    positions: additionalFields?.positions,
    originalError: additionalFields?.originalError,
  });
}
