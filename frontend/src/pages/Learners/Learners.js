import React, {Fragment, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Query} from 'react-apollo';
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
import {useStore} from 'store';

import {GET_POTENTIAL_PARTNERS} from 'graphql/user';
import {LEARNER_PAGE_USERS_LIMIT} from 'constants/DataLimit';
import * as Routes from 'routes';

const Root = styled(Container)`
  margin-top: ${p => p.theme.spacing.lg};

  @media (min-width: ${p => p.theme.screen.lg}) {
    margin-left: ${p => p.theme.spacing.lg};
    padding: 0;
  }
`;

const FilterContainer = styled(Container)`
  margin-bottom: ${p => p.theme.spacing.lg};
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
  ${p => p.width && `width: ${p.width}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${p => p.theme.spacing.sm};
  margin-top: ${p => p.theme.spacing.sm};
  &:nth-child(n + 4) {
    order: 2;
  }
`;

const LearnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 20px;
  margin-bottom: ${p => p.theme.spacing.lg};
`;

const LinkContainer = styled(Container)`
  margin-bottom: ${p => p.theme.spacing.lg};
  margin-left: 0;
`;

const Link = styled(NavLink)`
  letter-spacing: 0.5px;
  font-style: none;
  margin-left: 10px;
  transition: opacity 0.1s;
  border: 0;
  color: ${p => p.theme.colors.white};
  font-size: ${p => p.theme.font.size.xs};
  border-radius: ${p => p.theme.radius.sm};
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
  background-color: ${p => p.color ? p.theme.colors[p.color] : p.theme.colors.primary.main};
  justify-content: center;
  align-items: center;
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
        city: "",
        sex: "",
        age: ""
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setVariables({...variables, [name]: value});
    };

    return (
        <Root maxWidth="md">
            <Head title="Find language partners"/>
            <LinkContainer>
                Find partners by their posts instead!
                <Link exact activeClassName="selected" to={Routes.EXPLORE}>
                    Find by Posts
                </Link>
            </LinkContainer>
            <FilterContainer>
                <H3>Filter users by</H3>
                <FilterBase>
                    <Filter>
                        District:
                    </Filter>
                    <Filter width="10em">
                        <Select
                        type="text"
                        name="city"
                        values={variables.city}
                        onChange={handleChange}
                        borderColor="white"
                        defaultValue="DEFAULT"
                        >
                            {
                                ["", "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
                                "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
                                "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "NuwaraEliya", "Polonnaruwa", 
                                "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"]
                                .map((city, index) => {
                                    if (city === "") {
                                        return <option key="" value="DEFAULT" disabled>Select district</option>
                                    } else {
                                        return <option key={`city${index}`} value={city}>{city}</option>
                                    }
                                })
                            }
                        </Select>
                    </Filter>
                    <Filter>
                        Gender:
                    </Filter>
                    <Filter width="10em">
                        <Select
                            type="text"
                            name="sex"
                            values={variables.sex}
                            onChange={handleChange}
                            borderColor="white"
                            defaultValue="DEFAULT"
                        >
                            <option key="" value="DEFAULT" disabled>Select sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Select>
                    </Filter>
                    <Filter>
                        Age:
                    </Filter>
                    <Filter width="10em">
                            <Select
                                type="text"
                                name="age"
                                values={variables.age}
                                onChange={handleChange}
                                borderColor="white"
                                defaultValue="DEFAULT"
                            >
                                {
                                    Array.from(new Array(11),( val, index) => index).reverse()
                                    .map((year, index) => {
                                        if (year === 10) {
                                            return <option key="" value="DEFAULT" disabled>Select year</option>
                                        } else {
                                            return <option key={`year${index}`} value={(year * 10) + '-' + ((year + 1) * 10)}>{(year * 10) + '-' + ((year + 1) * 10)}</option>
                                        }
                                    })
                                }
                            </Select>
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
