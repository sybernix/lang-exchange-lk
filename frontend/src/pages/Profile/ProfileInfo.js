import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Link, generatePath} from 'react-router-dom';
import {useSubscription} from '@apollo/react-hooks';

import {IS_USER_ONLINE_SUBSCRIPTION} from 'graphql/user';

import {H1} from 'components/Text';
import {Spacing} from 'components/Layout';
import Follow from 'components/Follow';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileCoverUpload from './ProfileCoverUpload';

import {useStore} from 'store';

import * as Routes from 'routes';

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

const Language = styled.span`
  // font-size: ${p => p.theme.font.size.xs};
  // color: ${p => p.theme.colors.grey[600]};
  padding: 0 ${p => p.theme.spacing.xs};
  //text-transform: capitalize;
`;

// const IntroductionBase = styled.label`
//   padding: 1px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin-top: ${p => p.theme.spacing.sm};
//   font-size: ${p => p.theme.font.size.xs};
//   color: ${p => p.theme.colors.grey[600]};
//   border-radius: ${p => p.theme.radius.sm};
//   background-color: ${p => p.theme.colors.grey[600]};
//   transition: background-color 0.4s;
//   box-shadow: ${p => p.theme.shadows.sm};
// `;

const Introduction = styled.label`
  //padding: 10px 10ch;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: justify;
  margin-top: ${p => p.theme.spacing.sm};
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
  border-radius: ${p => p.theme.radius.sm};
  // background-color: ${p => p.theme.colors.grey[200]};
  //transition: background-color 0.4s;
  // box-shadow: ${p => p.theme.shadows.sm};
`;

/**
 * Renders user information in profile page
 */
const ProfileInfo = ({user}) => {
    const [{auth}] = useStore();

    const {data, loading} = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
        variables: {authUserId: auth.user.id, userId: user.id},
    });

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
            {/*<IntroductionBase>*/}
                <Introduction>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed neque sit amet mi lacinia
                    aliquam vel in velit. Cras nec turpis imperdiet, tincidunt erat id, porta purus. In iaculis purus
                    ac scelerisque lacinia. Donec eu pharetra ligula. Nunc consequat mauris vel mi pellentesque, et
                    fringilla eros ullamcorper. Aliquam sed nulla vitae lectus fringilla blandit a ac odio. Praesent
                    ullamcorper id lectus sed ornare. Proin faucibus mattis sodales. Duis sodales nulla aliquet eros
                    accumsan lacinia. Nam tellus arcu, fringilla id quam sed, laoreet fermentum sapien.
                </Introduction>
            {/*</IntroductionBase>*/}
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
                    <Language>
                        speaks {user.nativeLanguage}
                    </Language>
                    <Language>
                        learning {user.targetLanguage}
                    </Language>
                </Info>
            </InfoBase>
        </Root>
    );
};

ProfileInfo.propTypes = {
    user: PropTypes.object.isRequired,
};

export default ProfileInfo;
