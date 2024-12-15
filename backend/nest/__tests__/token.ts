import { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLQuery } from './buch/buch-mutation.resolver.test';
import { type GraphQLResponseBody } from './buch/buch-query.resolver.test';
import { tokenPath } from './testserver';
import { getLogger } from '../src/logger/logger';

type TokenResult = {
    access_token: string;
};

const usernameDefault = 'admin';
const passwordDefault = 'p';

export const tokenRest = async (
    axiosInstance: AxiosInstance,
    username = usernameDefault,
    password = passwordDefault,
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response: AxiosResponse<TokenResult> = await axiosInstance.post(
        tokenPath,
        `username=${username}&password=${password}`,
        { headers },
    );
    getLogger('tokenRest').debug('Token: %s', response.data.access_token);
    return response.data.access_token;
};

export const tokenGraphQL = async (
    axiosInstance: AxiosInstance,
    username: string = usernameDefault,
    password: string = passwordDefault,
): Promise<string> => {
    const body: GraphQLQuery = {
        query: `
            mutation {
                token(
                    username: "${username}",
                    password: "${password}"
                ) {
                    access_token
                }
            }
        `,
    };

    const response: AxiosResponse<GraphQLResponseBody> =
        await axiosInstance.post('graphql', body, { });

    const data = response.data.data!;
    return data.token.access_token; // eslint-disable-line @typescript-eslint/no-unsafe-return
};
