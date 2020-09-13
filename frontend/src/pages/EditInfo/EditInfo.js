import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import styled from 'styled-components';

import Skeleton from 'components/Skeleton';
import {H2} from 'components/Text';
import {InputText, Button, Select} from 'components/Form';
import {Container, Spacing} from 'components/Layout';
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

const Form = styled.div`
  padding: ${p => p.theme.spacing.md};
  border-radius: ${p => p.theme.radius.sm};
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;

  @media (min-width: ${p => p.theme.screen.sm}) {
    width: 450px;
  }
`;

/**
 * User Edit Info Page
 */
const EditInfo = ({match}) => {
    const [{auth}] = useStore();
    const [values, setValues] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        nativeLanguage: '',
        targetLanguage: '',
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
    };

    const handleSubmit = (e, signup) => {
        e.preventDefault();

        // const error = validate();
        // if (error) {
        //     setError(error);
        //     return false;
        // }

        // signup().then(async ({data}) => {
        //     localStorage.setItem('token', data.signup.token);
        //     await refetch();
        //     history.push(Routes.HOME);
        // });
    };
    
    // const username = "sdf";

    return (
        <Root>
            <Head title={auth.user.username}/>
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
                                <h3>Hello from edit info</h3>
                                <Form>
                                    <Spacing bottom="md">
                                        <H2>Create Account</H2>
                                    </Spacing>

                                    <form onSubmit={e => handleSubmit(e)}>
                                        <InputText
                                            type="text"
                                            name="fullName"
                                            // values={fullName}
                                            onChange={handleChange}
                                            placeholder="Full name"
                                            borderColor="white"
                                        />
                                        <Spacing top="xs" bottom="xs">
                                            <InputText
                                                type="text"
                                                name="email"
                                                // values={email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                borderColor="white"
                                            />
                                        </Spacing>
                                        <InputText
                                            type="text"
                                            name="username"
                                            // values={username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            borderColor="white"
                                        />
                                        <Spacing top="xs" bottom="xs">
                                            <InputText
                                                type="password"
                                                name="password"
                                                // values={password}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                borderColor="white"
                                            />
                                        </Spacing>
                                        <Select
                                            type="text"
                                            name="nativeLanguage"
                                            // values={nativeLanguage}
                                            onChange={handleChange}
                                            borderColor="white"
                                        >
                                            <option value="" disabled selected>Native Language</option>
                                            <option value="english">English</option>
                                            <option value="sinhala">Sinhala</option>
                                            <option value="tamil">Tamil</option>
                                        </Select>

                                        <Spacing top="xs" bottom="xs">
                                            <Select
                                                type="text"
                                                name="targetLanguage"
                                                // values={targetLanguage}
                                                onChange={handleChange}
                                                borderColor="white"
                                            >
                                                <option value="" disabled selected>Target Language</option>
                                                <option value="english">English</option>
                                                <option value="sinhala">Sinhala</option>
                                                <option value="tamil">Tamil</option>
                                            </Select>
                                        </Spacing>

                                        {/* {renderErrors(apiError)} */}

                                        <Spacing top="sm"/>
                                        <Button size="large" disabled={loading}>
                                            Sign up
                                        </Button>
                                    </form>
                                </Form>
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
