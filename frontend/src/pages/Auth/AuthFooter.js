import React from 'react';
import styled from 'styled-components';
import {Container} from 'components/Layout';

const Root = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  background-color: transparent;
`;

const StyledContainer = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 ${p => p.theme.spacing.sm};

  @media (min-width: ${p => p.theme.screen.md}) {
    justify-content: space-between;
  }
`;


const Copyright = styled.div`
  display: none;
  color: ${p => p.theme.colors.white};
  font-size: ${p => p.theme.font.size.xxs};
  a {
    color: #47ccff;
  }
  a:visited {
    color: white;
  }

  @media (min-width: ${p => p.theme.screen.md}) {
    display: block;
  }
`;

// const Link = styled.a`
//   color: #47ccff;
// `;

/**
 * Display Copyright notice
 */
const AuthFooter = props => {
    return (
        <Root>
            <StyledContainer maxWidth="lg">
                <Copyright>&copy; 2020 <a href="https://www.niruhan.com" target="_blank" rel="noopener noreferrer ">Niruhan Viswarupan</a></Copyright>
            </StyledContainer>
        </Root>
    );
};

export default AuthFooter;
