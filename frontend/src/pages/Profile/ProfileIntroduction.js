import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Mutation} from "react-apollo";
import {Button} from 'components/Form';
import styled from "styled-components";
import {Error} from 'components/Text';
import {Spacing} from 'components/Layout';
import {ADD_INTRODUCTION} from 'graphql/user';

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
  //width: 100%;
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

const ProfileIntroduction = props => {
    const [introductionText, setIntroductionText] = useState(props.initialIntroduction);
    const [introductionAdded, setIntroductionAdded] = useState(false);
    const [error, setError] = useState('');

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

    return (
        <React.Fragment>
            {(props.initialIntroduction !== null || introductionAdded) && <Introduction> {introductionText} </Introduction>}

            {props.initialIntroduction === null && !introductionAdded && props.userId === props.authId &&
            <Mutation
                mutation={ADD_INTRODUCTION}
                variables={{input: {introductionText, userId: props.authId}}}
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
        </React.Fragment>
    );
};

ProfileIntroduction.propTypes = {
    userId: PropTypes.string.isRequired,
    authId: PropTypes.string.isRequired,
    initialIntroduction: PropTypes.string.isRequired,
};

export default ProfileIntroduction;