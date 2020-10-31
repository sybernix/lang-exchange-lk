import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {generatePath} from 'react-router-dom';
import styled from 'styled-components';
import {withApollo} from 'react-apollo';

import {A} from 'components/Text';
import {Spacing} from 'components/Layout';
import Avatar from 'components/Avatar';

import {useClickOutside} from 'hooks/useClickOutside';

import * as Routes from 'routes';

const NotificationItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${p => p.theme.spacing.xs};
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  font-size: ${p => p.theme.font.size.xxs};
  background-color: ${p => p.theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.div`
  font-weight: ${p => p.theme.font.weight.bold};
`;

/**
 * Renders user notifications
 */
const FollowerCard = ({follower, close, client}) => {
    const ref = React.useRef(null);

    useClickOutside(ref, close);

    if (!follower.id && !follower.fullName && !follower.username) {
        return null;
    }

    return (
        <NotificationItem ref={ref}>
            <A
                to={generatePath(Routes.USER_PROFILE, {
                    username: follower.username,
                })}
            >
                <LeftSide>
                    <Avatar image={follower.image} size={34}/>

                    <Spacing left="xs"/>

                    <Name>{follower.fullName}</Name>
                </LeftSide>
            </A>
        </NotificationItem>
    );
};

Notification.propTypes = {
    client: PropTypes.object.isRequired,
    close: PropTypes.func,
};

export default withApollo(FollowerCard);
