import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Mutation} from "react-apollo";
import {Button} from 'components/Form';
import styled from "styled-components";
import {Error} from 'components/Text';
import {Spacing, Overlay, Container} from 'components/Layout';
import {ADD_INTRODUCTION} from 'graphql/user';

const Root = styled(Container)`
  border: 0;
  /* max-width: ${p => p.theme.screen.sm}; */
  padding: 0;
  margin-top: 0;
`;

const Form = styled.form`
  margin-top: ${p => p.theme.spacing.xs};
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.lg};
  border: 0;
  display: flex;
  flex-direction: column;
  outline: none;
  resize: none;
  max-width: ${p => p.theme.screen.sm};
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.xs} 0 ${p => p.theme.spacing.xs};
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${p => (p.focus ? '6em' : '4em')};
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
  justify-content: flex-end;
  align-items: center;
  padding: ${p => p.theme.spacing.sm} 0;
`;

const Introduction = styled.label`
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  text-align: justify;
  margin-top: ${p => p.theme.spacing.sm};
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
  border-radius: ${p => p.theme.radius.sm};
  max-width: ${p => p.theme.screen.sm}
`;

const ProfileIntroduction = props => {
    const [introductionText, setIntroductionText] = useState(props.initialIntroduction === null ? '' : props.initialIntroduction);
    const [introductionAdded, setIntroductionAdded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e, addIntroduction) => {
        e.preventDefault();
        addIntroduction();
        setIntroductionAdded(true);
    };

    const handleReset = () => {
        setIntroductionText('');
        setError('');
        setIsFocused(false);
    };

    const handleIntroChange = e => setIntroductionText(e.target.value);

    const handleOnFocus = () => setIsFocused(true);

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
                        <>
                        {isFocused && <Overlay onClick={handleReset}/>}
                            <Root
                                zIndex={isFocused ? 'md' : 'xs'}
                                color={isFocused ? 'mygrey2' : 'mygrey'}
                                radius="sm"
                                // padding="sm"
                            >
                                <Form onSubmit={e => handleSubmit(e, addIntroduction)}>
                                    <Textarea
                                        type="textarea"
                                        name="title"
                                        value={introductionText}
                                        focus={isFocused}
                                        onFocus={handleOnFocus}
                                        onChange={handleIntroChange}
                                        placeholder="Add introduction about yourself!"
                                    />
                                    {isFocused && (
                                        <Options>
                                            <Buttons>
                                                <Button text type="button" onClick={handleReset}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={isShareDisabled}>
                                                    Save
                                                </Button>
                                            </Buttons>
                                        </Options>
                                    )}

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
                                </Form>
                            </Root>
                        </>
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
    initialIntroduction: PropTypes.string,
};

export default ProfileIntroduction;