import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import {Mutation} from 'react-apollo';

import Skeleton from 'components/Skeleton';
import {H2} from 'components/Text';
import {InputText, Button, Select, Textarea} from 'components/Form';
import {Container, Spacing, Content} from 'components/Layout';
import Head from 'components/Head';

import {GET_USER} from 'graphql/user';
import {UPDATE_ACCOUNT_INFO} from 'graphql/user';
import * as Routes from 'routes';

import {useStore} from 'store';

// const Root = styled.div`
//   width: 100%;

//   @media (min-width: ${p => p.theme.screen.lg}) {
//     margin-left: ${p => p.theme.spacing.lg};
//     padding: 0;
//   }
// `;

const Root = styled(Container)`
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.sm};

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
const EditInfo = ({history, refetch}) => {
    const [{auth}] = useStore();
    const [values, setValues] = useState({
        id: auth.user.id,
        fullName: '',
        email: auth.user.email,
        nativeLanguage: auth.user.nativeLanguage,
        targetLanguage: auth.user.targetLanguage,
        introduction: auth.user.introduction,
        age: 10,
        sex: '',
        city: '',
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
    };

    const handleSubmit = (e, editinfo) => {
        e.preventDefault();

        // const error = validate();
        // if (error) {
        //     setError(error);
        //     return false;
        // }

        editinfo().then(async ({message}) => {
            console.log(message);
            console.log(refetch);
            await refetch();
            history.push(auth.user.username);
        });
    };

    const {id, fullName, email, nativeLanguage, targetLanguage, introduction, age, sex, city} = values;
    // todo find a way to do this only once
    // setValues({...values, ['id']: auth.user.id},[]);
    // {console.log(values);}
    
    // const username = "sdf";

    return (
        <Root>
            <Head title={auth.user.username}/>
            {/* {const {username} = auth.user.username;} */}
            {/* {console.log(auth)} */}
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
                    // {console.log(data);}

                    // if (error || !data.getUser) return <NotFound/>;

                    return (
                        <Content>
                        <Root maxWidth="md">
                            <Mutation
                                mutation={UPDATE_ACCOUNT_INFO}
                                variables={{input: {id, fullName, email, nativeLanguage, targetLanguage, introduction, age, sex, city}}}
                            >
                                {(editinfo, {loading, error: apiError}) => {
                                    return (
                                        <Container padding="xxs">
                                            <Container maxWidth="sm">
                                                {/* <h3>Hello from edit info</h3> */}
                                                <Form>
                                                    <Spacing bottom="md">
                                                        <H2>Update Account Information</H2>
                                                    </Spacing>

                                                    <form onSubmit={e => handleSubmit(e, editinfo)}>
                                                        <InputText
                                                            type="text"
                                                            name="fullName"
                                                            defaultValue={data.getUser.fullName}
                                                            values={fullName}
                                                            onChange={handleChange}
                                                            placeholder="Full name"
                                                            borderColor="white"
                                                        />
                                                        <Spacing top="xs" bottom="xs">
                                                            <InputText
                                                                type="text"
                                                                name="email"
                                                                defaultValue={data.getUser.email}
                                                                values={email}
                                                                onChange={handleChange}
                                                                placeholder="Email"
                                                                borderColor="white"
                                                            />
                                                        </Spacing>
                                                        <Select
                                                            type="text"
                                                            name="nativeLanguage"
                                                            defaultValue={data.getUser.nativeLanguage}
                                                            values={nativeLanguage}
                                                            onChange={handleChange}
                                                            borderColor="white"
                                                        >
                                                            <option value="" disabled>Native Language</option>
                                                            <option value="english">English</option>
                                                            <option value="sinhala">Sinhala</option>
                                                            <option value="tamil">Tamil</option>
                                                        </Select>

                                                        <Spacing top="xs" bottom="xs">
                                                            <Select
                                                                type="text"
                                                                name="targetLanguage"
                                                                defaultValue={data.getUser.targetLanguage}
                                                                values={targetLanguage}
                                                                onChange={handleChange}
                                                                borderColor="white"
                                                            >
                                                                <option value="" disabled>Target Language</option>
                                                                <option value="english">English</option>
                                                                <option value="sinhala">Sinhala</option>
                                                                <option value="tamil">Tamil</option>
                                                            </Select>
                                                        </Spacing>
                                                        <Textarea
                                                            type="text"
                                                            name="introduction"
                                                            defaultValue={data.getUser.introduction}
                                                            values={introduction}
                                                            onChange={handleChange}
                                                            placeholder="Introduction About Yourself"
                                                            borderColor="white"
                                                        />

                                                        {/* {renderErrors(apiError)} */}

                                                        <Spacing top="sm"/>
                                                        <Button size="large" disabled={loading}>
                                                            Update
                                                        </Button>
                                                    </form>
                                                </Form>
                                            </Container>
                                        </Container>
                                    );
                                }}
                            </Mutation>
                        </Root>
                        </Content>
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
