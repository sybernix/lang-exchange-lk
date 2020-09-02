import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Link, generatePath} from 'react-router-dom';
import {useSubscription} from '@apollo/react-hooks';
import {IS_USER_ONLINE_SUBSCRIPTION, ADD_INTRODUCTION} from 'graphql/user';

import {H1, Error} from 'components/Text';
import {Spacing} from 'components/Layout';
import Follow from 'components/Follow';
import {Button} from 'components/Form';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileCoverUpload from './ProfileCoverUpload';

import {useStore} from 'store';

import * as Routes from 'routes';
import {Mutation} from "react-apollo";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -140px;
`;

const FullName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${p => p.theme.spacing.sm};
  position: relative;

  ${H1} {
    font-size: ${p => p.theme.font.size.lg};
  }

  @media (min-width: ${p => p.theme.screen.md}) {
    ${H1} {
      font-size: ${p => p.theme.font.size.xl};
    }
  }
`;

const FollowAndMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: ${p => p.theme.spacing.sm};
`;

const Message = styled(Link)`
  text-decoration: none;
  font-size: ${p => p.theme.font.size.xs};
`;

const Online = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${p => p.theme.colors.success};
  margin-left: ${p => p.theme.spacing.sm};
  border-radius: 50%;
`;

const InfoBase = styled.div`
  display: flex;
  flex-direction: row;
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
 
  margin-top: ${p => p.theme.spacing.sm};
`;

const List = styled.div`
  padding: 0 ${p => p.theme.spacing.xs};
  white-space: nowrap;
  @media (min-width: ${p => p.theme.screen.md}) {
    padding: 0 ${p => p.theme.spacing.lg};
  }
`;

const Language = styled.text`
  // font-size: ${p => p.theme.font.size.xs};
  // color: ${p => p.theme.colors.grey[600]};
  // padding: 0 ${p => p.theme.spacing.xs};
  text-transform: capitalize;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${p => p.theme.spacing.sm} 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin: 0 ${p => p.theme.spacing.xs};
  padding-left: ${p => p.theme.spacing.sm};
  padding-top: ${p => p.theme.spacing.xs};
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${p => (p.focus ? '80px' : '40px')};
  font-size: ${p => p.theme.font.size.xs};
  background-color: ${p => p.theme.colors.grey[100]};
  border-radius: ${p => p.theme.radius.md};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${p => p.theme.colors.border.main};
  padding: ${p => p.theme.spacing.sm} 0;
`;

const Introduction = styled.label`
  //padding: 10px 10ch;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.lg};
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: justify;
  margin-top: ${p => p.theme.spacing.sm};
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
  border-radius: ${p => p.theme.radius.sm};
  max-width: ${p => p.theme.screen.sm}
  // background-color: ${p => p.theme.colors.grey[200]};
  //transition: background-color 0.4s;
  // box-shadow: ${p => p.theme.shadows.sm};
`;

/**
 * Renders user information in profile page
 */
const ProfileInfo = ({user}) => {
    const [introductionText, setIntroductionText] = useState(user.introduction);
    const [introductionAdded, setIntroductionAdded] = useState(false);
    const [error, setError] = useState('');
    const [{auth}] = useStore();

    const {data, loading} = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
        variables: {authUserId: auth.user.id, userId: user.id},
    });

    const handleSubmit = async (e, addIntroduction) => {
        e.preventDefault();
        addIntroduction();
        setIntroductionAdded(true);
    };

    const handleReset = () => {
        setIntroductionText('');
        setError('');
    };

    const handleIntroChange = e => setIntroductionText(e.target.value);

    let isUserOnline = user.isOnline;
    if (!loading && data) {
        isUserOnline = data.isUserOnline.isOnline;
    }

    return (
        <Root>
            <ProfileCoverUpload
                userId={user.id}
                coverImage={user.coverImage}
                coverImagePublicId={user.coverImagePublicId}
            />

            <ProfileImage>
                <ProfileImageUpload
                    userId={user.id}
                    image={user.image}
                    imagePublicId={user.imagePublicId}
                    username={user.username}
                />

                <FullName>
                    <H1>{user.fullName}</H1>

                    {isUserOnline && auth.user.id !== user.id && <Online/>}

                    {auth.user.id !== user.id && (
                        <FollowAndMessage>
                            <Follow user={user}/>

                            <Spacing left="sm"/>
                            <Message to={generatePath(Routes.MESSAGES, {userId: user.id})}>
                                Message
                            </Message>
                        </FollowAndMessage>
                    )}
                </FullName>
            </ProfileImage>
            {(user.introduction !== null || introductionAdded) && <Introduction> {introductionText} </Introduction>}

            {user.introduction === null && !introductionAdded &&
            <Mutation
                mutation={ADD_INTRODUCTION}
                variables={{input: {introductionText, userId: auth.user.id}}}
            >
                {(addIntroduction, {loading, error: apiError}) => {
                    const isShareDisabled = loading || (!loading && !introductionText);

                    return (
                        <form onSubmit={e => handleSubmit(e, addIntroduction)}>
                            <Wrapper>
                                <Textarea
                                    type="textarea"
                                    name="title"
                                    value={introductionText}
                                    onChange={handleIntroChange}
                                    placeholder="Add introduction about yourself!"
                                />
                            </Wrapper>
                            <Options>
                                <Buttons>
                                    <Button text type="button" onClick={handleReset}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Share
                                    </Button>
                                </Buttons>
                            </Options>

                            {apiError ||
                            (error && (
                                <Spacing top="xs" bottom="sm">
                                    <Error size="xs">
                                        {apiError
                                            ? 'Something went wrong, please try again.'
                                            : error}
                                    </Error>
                                </Spacing>
                            ))}
                        </form>
                    );
                }}
            </Mutation>
            }
            <InfoBase>
                <Info>
                    <List>
                        <b>{user.followers.length} </b> followers
                    </List>
                    <List>
                        <b>{user.following.length} </b> following
                    </List>
                </Info>
                <Info>
                    <List>
                        speaks <Language>{user.nativeLanguage}</Language>
                    </List>
                    <List>
                        learning <Language>{user.targetLanguage}</Language>
                    </List>
                </Info>
            </InfoBase>
        </Root>
    );
};

ProfileInfo.propTypes = {
    user: PropTypes.object.isRequired,
};

export default ProfileInfo;
