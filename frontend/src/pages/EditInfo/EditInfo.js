import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import {Mutation} from 'react-apollo';
import {useQuery} from '@apollo/react-hooks';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Skeleton from 'components/Skeleton';
import {H2} from 'components/Text';
import {InputText, Button, Select} from 'components/Form';
import {Container, Spacing, Content} from 'components/Layout';
import Head from 'components/Head';

import {GET_USER} from 'graphql/user';
import {UPDATE_ACCOUNT_INFO} from 'graphql/user';

import {useStore} from 'store';

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

const Label = styled.p`
  padding-left: ${p => p.theme.spacing.xs};
  margin-bottom: 1px;
  color: ${p => p.theme.colors.text.primary};
`;

const Select2 = styled(Select)`
  padding-left: 6px;
`;

const Textarea = styled.textarea`
  outline: 0;
  height: 36px;
  width: 100%;
  resize: none;
  transition: border 0.1s;
  border-radius: ${p => p.theme.radius.sm};
  padding-left: ${p => p.theme.spacing.xs};
  height: 10em;
  border: 1px solid
    ${p =>
    p.borderColor
        ? p.theme.colors[p.borderColor]
        : p.theme.colors.border.main};
  color: ${p => p.theme.colors.text.secondary};

  &:focus {
    border-color: ${p => p.theme.colors.border.main};
  }
`;

/**
 * User Edit Info Page
 */
const EditInfo = ({history}) => {
    const [{auth}] = useStore();
    const {refetch} = useQuery(GET_USER, {variables: {id: auth.user.id}});
    const [values, setValues] = useState({
        id: auth.user.id,
        fullName: '',
        email: '',
        nativeLanguage: '',
        targetLanguage: '',
        introduction: '',
        dateOfBirth: new Date(),
        sex: '',
        city: '',
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
    };

    const handleDateOfBirthChange = e => {
        setValues({...values, 'dateOfBirth': e});
    };

    const handleSubmit = (e, editinfo) => {
        e.preventDefault();
        editinfo().then(async ({message}) => {
            await refetch({id: auth.user.id});
            history.push(auth.user.username);
        });
    };

    const {id, fullName, email, nativeLanguage, targetLanguage, introduction, dateOfBirth, sex, city} = values;

    return (
        <Root>
            <Head title={auth.user.username}/>
            <Query fetchPolicy="no-cache" query={GET_USER} variables={{username: auth.user.username}}>
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
                    return (
                        <Content>
                        <Root maxWidth="md">
                            <Mutation
                                mutation={UPDATE_ACCOUNT_INFO}
                                variables={{input: {id, fullName, email, nativeLanguage, targetLanguage, introduction, dateOfBirth, sex, city}}}
                            >
                                {(editinfo, {loading, error: apiError}) => {
                                    return (
                                        <Container padding="xxs">
                                            <Container maxWidth="sm">
                                                <Form>
                                                    <Spacing bottom="md">
                                                        <H2>Update Account Information</H2>
                                                    </Spacing>

                                                    <form onSubmit={e => handleSubmit(e, editinfo)}>
                                                        <Label>Full name:</Label>
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
                                                        <Label>E-mail:</Label>
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
                                                        <Label>Native Language:</Label>
                                                        <Select2
                                                            type="text"
                                                            name="nativeLanguage"
                                                            defaultValue={data.getUser.nativeLanguage}
                                                            values={nativeLanguage}
                                                            onChange={handleChange}
                                                            borderColor="white"
                                                        >
                                                            <option value="english">English</option>
                                                            <option value="sinhala">Sinhala</option>
                                                            <option value="tamil">Tamil</option>
                                                        </Select2>
                                                        <Spacing top="xs" bottom="xs">
                                                            <Label>Target Language:</Label>
                                                            <Select2
                                                                type="text"
                                                                name="targetLanguage"
                                                                defaultValue={data.getUser.targetLanguage}
                                                                values={targetLanguage}
                                                                onChange={handleChange}
                                                                borderColor="white"
                                                            >
                                                                <option value="english">English</option>
                                                                <option value="sinhala">Sinhala</option>
                                                                <option value="tamil">Tamil</option>
                                                            </Select2>
                                                        </Spacing>
                                                        <Label>Introduction:</Label>
                                                        <Textarea
                                                            type="text"
                                                            name="introduction"
                                                            defaultValue={data.getUser.introduction}
                                                            values={introduction}
                                                            onChange={handleChange}
                                                            placeholder="Introduction About Yourself"
                                                            borderColor="white"
                                                        />
                                                        <Spacing top="xs" bottom="xs">
                                                            <Label>Date of Birth:</Label>
                                                            <DatePicker 
                                                                name="dateOfBirth"
                                                                selected={parseInt(data.getUser.dateOfBirth)} 
                                                                onChange={date => handleDateOfBirthChange(date)} 
                                                            />
                                                        </Spacing>
                                                        <Label>Gender:</Label>
                                                        <Select2
                                                            type="text"
                                                            name="sex"
                                                            defaultValue={data.getUser.sex}
                                                            values={sex}
                                                            onChange={handleChange}
                                                            borderColor="white"
                                                        >
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </Select2>
                                                        <Spacing top="xs" bottom="xs">
                                                            <Label>City:</Label>
                                                            <Select2
                                                                type="text"
                                                                name="city"
                                                                defaultValue={data.getUser.city}
                                                                values={city}
                                                                onChange={handleChange}
                                                                borderColor="white"
                                                            >
                                                                {
                                                                    ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
                                                                    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
                                                                    "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "NuwaraEliya", "Polonnaruwa", 
                                                                    "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"]
                                                                    .map((city, index) => {
                                                                        return <option key={`city${index}`} value={city}>{city}</option>
                                                                    })
                                                                }
                                                            </Select2>
                                                        </Spacing>
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
