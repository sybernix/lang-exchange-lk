import React from 'react';
import styled from 'styled-components';
import {Query} from 'react-apollo';

import {Container, Content} from 'components/Layout';
import {Loading} from 'components/Loading';
import Skeleton from 'components/Skeleton';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import Head from 'components/Head';
import FollowerCard from './FollowerCard';

import {useStore} from 'store';

import {NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT} from 'constants/DataLimit';
import { GET_FOLLOWERS } from 'graphql/follow';

const Root = styled(Container)`
  margin-top: ${p => p.theme.spacing.lg};
`;

const List = styled.div`
  overflow: hidden;
  border-radius: ${p => p.theme.radius.sm};
  border: 1px solid ${p => p.theme.colors.border.main};
`;

/**
 * Followers page showing the list of users who follow the auth user
 */
const Followers = () => {
    const [{auth}] = useStore();

    const variables = {
        userId: auth.user.id,
        skip: 0,
        limit: NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT,
    };

    return (
        <Content>
            <Root maxWidth="md">
                <Head title={`${auth.user.username}'s Followers`}/>

                <Query
                    query={GET_FOLLOWERS}
                    variables={variables}
                    notifyOnNetworkStatusChange
                >
                    {({data, loading, fetchMore, networkStatus}) => {
                        if (loading && networkStatus === 1) {
                            return (
                                <Skeleton
                                    height={56}
                                    bottom="xxs"
                                    count={NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT}
                                />
                            );
                        }

                        console.log(data.getFollowers);

                        if (!data.getFollowers.length) {
                            return <Empty text="No followers yet."/>;
                        }

                        return (
                            <InfiniteScroll
                                data={data.getFollowers}
                                dataKey="getUserNotifications.notifications"
                                count={parseInt(data.getFollowers.length)}
                                variables={variables}
                                fetchMore={fetchMore}
                            >
                                {data => {
                                    const showNextLoading =
                                        loading && networkStatus === 3;

                                    return (
                                        <>
                                            <List>
                                                {data.map(follower => (
                                                    <FollowerCard
                                                        key={follower.id}
                                                        follower={follower}
                                                        close={() => false}
                                                    />
                                                ))}
                                            </List>

                                            {showNextLoading && <Loading top="lg"/>}
                                        </>
                                    );
                                }}
                            </InfiniteScroll>
                        );
                    }}
                </Query>
            </Root>
        </Content>
    );
};

export default Followers;
