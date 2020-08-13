import React, {useEffect, useState} from 'react';
import {useGetUsers} from '../../Services/userService';
import {makeStyles} from "@material-ui/core/styles";
import {grey} from '@material-ui/core/colors';
import { Helmet } from 'react-helmet'
import Header from "../Layout/Header";

const useStyles = makeStyles(theme => ({
    list: {
        maxHeight: '80vh',
        overflowY: 'auto',
        margin: '10px 0px'
    },
    avatar: {
        margin: theme.spacing(0, 3, 0, 1),
    },
    name: {
        fontSize: 20,
        textTransform: 'capitalize',
    },
    subtitle: {
        fontSize: 12,
        textTransform: 'capitalize',
        color: grey["500"],
    },
}));

const Profile = props => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const getUsers = useGetUsers();

    useEffect(() => {
        getUsers().then(res => setUsers(res));
    }, []);

    useEffect(() => {
        console.log(users);
    });

    return (
        <React.Fragment>
            <Helmet>
                <title>{ 'Discover Language Partners | LangExchange.lk' }</title>
            </Helmet>
            <Header/>

        </React.Fragment>
    )
};

Profile.propTypes = {};

export default Profile
