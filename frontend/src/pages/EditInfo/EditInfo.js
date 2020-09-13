import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import styled from 'styled-components';

import Skeleton from 'components/Skeleton';
import {Container, Spacing} from 'components/Layout';
// import ProfileInfo from './ProfileInfo';
import CreatePost from 'components/CreatePost';
// import ProfilePosts from './ProfilePosts';
// import NotFound from 'components/NotFound';
import Head from 'components/Head';

import {GET_USER} from 'graphql/user';

import {useStore} from 'store';

const Root = styled.div`
  width: 100%;

  @media (min-width: ${p => p.theme.screen.lg}) {
    margin-left: ${p => p.theme.spacing.lg};
    padding: 0;
  }
`;

/**
 * User Edit Info Page
 */
const EditInfo = ({match}) => {
    const [{auth}] = useStore();
    
    // const username = "sdf";

    return (
        <Root>
            <Head title={auth.user.username}/>
            <h3>Hello from edit info</h3>
            {/* {const {username} = auth.user.username;} */}
            {console.log(auth)}
            {/* {console.log(username)} */}
            <Query query={GET_USER} variables={{'username': auth.user.username}}>
                {({data, loading, error}) => {
                    if (loading) {
                        return (
                            <Container padding="xxs">
                                <Skeleton height={350}/>
                                <Container maxWidth="sm">
                                    <Spacing top="lg" bottom="lg">
                                        <Skeleton height={82}/>
                                    </Spacing>
                                </Container>
                            </Container>
                        );
                    }
                    {console.log(data);}

                    // if (error || !data.getUser) return <NotFound/>;

                    return (
                        <Container padding="xxs">
                            <Container maxWidth="sm">
                                {/* <ProfileInfo user={data.getUser}/> */}
                                {/* <Spacing top="lg" bottom="lg">
                                    {username === auth.user.username && <CreatePost/>}
                                </Spacing> */}

                                {/* <ProfilePosts username={username}/> */}
                            </Container>
                        </Container>
                    );
                }}
            </Query>
        </Root>
    );
};

EditInfo.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(EditInfo);
