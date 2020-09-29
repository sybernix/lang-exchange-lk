import React, {Fragment, useState} from 'react';
import styled from 'styled-components';

import {Container} from 'components/Layout';
import Skeleton from 'components/Skeleton';
import {Loading} from 'components/Loading';
import Empty from 'components/Empty';
import InfiniteScroll from 'components/InfiniteScroll';
import Head from 'components/Head';
import {Select} from 'components/Form';
import {H3} from 'components/Text';
import LearnerCard from './LearnerCard';

import {GET_POTENTIAL_PARTNERS} from 'graphql/user';

import {LEARNER_PAGE_USERS_LIMIT} from 'constants/DataLimit';

import {useStore} from 'store';

import {Query} from 'react-apollo';

const Root = styled(Container)`
  margin-top: ${p => p.theme.spacing.lg};

  @media (min-width: ${p => p.theme.screen.lg}) {
    margin-left: ${p => p.theme.spacing.lg};
    padding: 0;
  }
`;

const FilterContainer = styled(Container)`
  margin-bottom: ${p => p.theme.spacing.lg};
  /* max-width: 15em; */
  margin-left: 0;
`;

const FilterBase = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap:  wrap;
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.grey[600]};
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${p => p.theme.spacing.sm}
  /* border-right: 1px ${p => p.theme.colors.grey[400]} ${p => p.border && 'solid'}; */
  margin-top: ${p => p.theme.spacing.sm};
`;

const LearnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 20px;
  margin-bottom: ${p => p.theme.spacing.lg};
`;

/**
 * Learners page
 */
const Learners = () => {
    const [{auth}] = useStore();
    const [variables, setVariables] = useState({
        userId: auth.user.id,
        skip: 0,
        limit: LEARNER_PAGE_USERS_LIMIT,
        city: '',
        sex: '',
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setVariables({...variables, [name]: value});
    };

    return (
        <Root maxWidth="md">
            <Head title="Find language partners"/>
            <FilterContainer>
                <H3>Filter learners by</H3>
                <FilterBase>
                    <Filter>
                        District: 
                    </Filter>
                    <Filter>
                        <Select
                        type="text"
                        name="city"
                        // defaultValue={data.getUser.city}
                        values={variables.city}
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
                        </Select>
                    </Filter>
                    <Filter>
                        Sex:
                    </Filter>
                    <Filter>
                        <Select
                            type="text"
                            name="sex"
                            // defaultValue={data.getUser.sex}
                            values={variables.sex}
                            onChange={handleChange}
                            borderColor="white"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Select>
                    </Filter>
                    <Filter>
                        <Select2
                                                                type="text"
                                                                name="age"
                                                                defaultValue={data.getUser.age}
                                                                values={age}
                                                                onChange={handleChange}
                                                                borderColor="white"
                                                            >
                                                                {
                                                                    Array.from(new Array(100),( val, index) => index).reverse()
                                                                    .map((year, index) => {
                                                                        return <option key={`year${index}`} value={year}>{year}</option>
                                                                    })
                                                                }
                                                            </Select2>
                    </Filter>
                </FilterBase>
            </FilterContainer>
            <Query
                query={GET_POTENTIAL_PARTNERS}
                variables={variables}
                notifyOnNetworkStatusChange
            >
                {({data, loading, fetchMore, networkStatus}) => {
                    if (loading && networkStatus === 1) {
                        return (
                            <LearnerContainer>
                                <Skeleton height={280} count={LEARNER_PAGE_USERS_LIMIT}/>
                            </LearnerContainer>
                        );
                    }

                    const {users, count} = data.getPotentialPartners;

                    if (!users.length > 0) return <Empty text="No learners yet."/>;

                    return (
                        <InfiniteScroll
                            data={users}
                            dataKey="getPotentialPartners.users"
                            count={parseInt(count)}
                            variables={variables}
                            fetchMore={fetchMore}
                        >
                            {data => {
                                const showNextLoading =
                                    loading && networkStatus === 3 && count !== data.length;

                                return (
                                    <Fragment>
                                        <LearnerContainer>
                                            {data.map(user => (
                                                <LearnerCard key={user.id} user={user}/>
                                            ))}
                                        </LearnerContainer>

                                        {showNextLoading && <Loading top="lg"/>}
                                    </Fragment>
                                );
                            }}
                        </InfiniteScroll>
                    );
                }}
            </Query>
        </Root>
    );
};

export default Learners;
