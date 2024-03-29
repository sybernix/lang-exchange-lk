import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { generatePath, Link, NavLink } from 'react-router-dom';
import { useSubscription } from '@apollo/react-hooks';
import { IS_USER_ONLINE_SUBSCRIPTION } from 'graphql/user';
import { useStore } from 'store';
import * as Routes from 'routes';

import { H1, A } from 'components/Text';
import { Spacing } from 'components/Layout';
import Follow from 'components/Follow';
import { PencilIcon, LocationIcon, MaleIcon, FemaleIcon } from 'components/icons';

import ProfileImageUpload from './ProfileImageUpload';
import ProfileCoverUpload from './ProfileCoverUpload';
import ProfileIntroduction from "./ProfileIntroduction";


const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.div`
  display: flex;
  flex-direction: column;
  /* flex: 0 1 auto; */
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
  flex-wrap:  wrap;
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px ${p => p.theme.colors.grey[400]} ${p => p.border && 'solid'};
  margin-top: ${p => p.theme.spacing.sm};
`;

const List = styled.div`
  padding: 0 ${p => p.theme.spacing.sm};
  white-space: nowrap;
  margin-top: ${p => p.top};
  @media (min-width: ${p => p.theme.screen.md}) {
    padding: 0 ${p => p.theme.spacing.lg};
  }
`;

const Language = styled.span`
  text-transform: ${p => p.transform && 'capitalize'};
  padding-left: ${p => p.left};
  padding-right: ${p => p.right};
  margin-top: ${p => p.top};
`;

const NavLink2 = styled(NavLink)`
  text-decoration: none;
  margin-left: auto; 
  margin-right: 2em;
  margin-top: 2em;
  font-size: ${p => p.theme.font.size.xs};
`;

/**
 * Renders user information in profile page
 */
const ProfileInfo = ({ user }) => {
  const [{ auth }] = useStore();
  const username = user.username;

  const { data, loading } = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
    variables: { authUserId: auth.user.id, userId: user.id },
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
      {auth.user.id === user.id &&
        <NavLink2 exact activeClassName="selected" to={Routes.EDIT_INFO}>
          <PencilIcon color='grey600' />
        </NavLink2>
      }
      <ProfileImage>
        <ProfileImageUpload
          userId={user.id}
          image={user.image}
          imagePublicId={user.imagePublicId}
          username={user.username}
        />
        <FullName>
          <H1>{user.fullName}</H1>
          {isUserOnline && auth.user.id !== user.id && <Online />}
          {auth.user.id !== user.id && (
            <FollowAndMessage>
              <Follow user={user} />

              <Spacing left="sm" />
              <Message to={generatePath(Routes.MESSAGES, { userId: user.id })}>
                Message
                            </Message>
            </FollowAndMessage>
          )}
        </FullName>
      </ProfileImage>
      <ProfileIntroduction authId={auth.user.id} userId={user.id} initialIntroduction={user.introduction} />
      <InfoBase>
        <Info border="true">
          <List>
              <A to={generatePath(Routes.FOLLOWERS, {username})}>
                <b>{user.followers.length} </b> followers
              </A>
          </List>
          <List top="0.5em">
            <A to={generatePath(Routes.FOLLOWING, {username})}>
              <b>{user.following.length} </b> following
            </A>
          </List>
        </Info>
        <Info border="true">
          <List>
            speaks <Language transform="true">{user.nativeLanguage}</Language>
          </List>
          <List top="0.5em">
            learning <Language transform="true">{user.targetLanguage}</Language>
          </List>
        </Info>
        <Info>
          {user.city &&
             <List>
              <LocationIcon width="15"/>
              <Language left="1em">{user.city}</Language>
           </List>
          }
          <List top="0.5em">
            {user.sex === "male" &&
              <MaleIcon width="13" color="grey500"/>
            }
            {user.sex === "female" &&
              <FemaleIcon width="15" color="grey500"/>
            }
            {user.dateOfBirth &&
              <Language left="1em">age {Math.floor((new Date() - user.dateOfBirth) / (365 * 24*60*60*1000))}</Language>
            }
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
