import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from "react-apollo";

const ProfileIntroduction = props => {
    return (
        <React.Fragment>
            {(props.initialIntroduction !== null || introductionAdded) && <Introduction> {introductionText} </Introduction>}

            {props.initialIntroduction === null && !introductionAdded &&
            <Mutation
                mutation={ADD_INTRODUCTION}
                variables={{input: {introductionText, userId: props.userId}}}
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
    initialIntroduction: PropTypes.string.isRequired,
};

export default ProfileIntroduction;