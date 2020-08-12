import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {useGetUsers} from '../../Services/userService';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/core/styles";
import {blue} from '@material-ui/core/colors';
import Header from "../Layout/Header";

const useStyles = makeStyles(theme => ({
    list: {
        maxHeight: '80vh',
        overflowY: 'auto',
    },
    avatar: {
        margin: theme.spacing(0, 3, 0, 1),
    },
}));

const Discover = props => {
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
            <Header/>
            <h3>Welcome to Discover Page</h3>
            <Link to="/chat">chat</Link>
            <List className={classes.list}>
                {users && (
                    <React.Fragment>
                        {users.map(u => (
                            <ListItem
                                className={classes.listItem}
                                key={u._id}
                                onClick={() => {
                                    // props.setUser(u);
                                    // props.setScope(u.name);
                                }}
                                button
                            >
                                <ListItemAvatar className={classes.avatar}>
                                    <Avatar>AD</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={<NameDetails {...u} />} secondary={u.description}/>
                            </ListItem>
                        ))}
                    </React.Fragment>
                )}
            </List>
        </React.Fragment>
    )
};

const NameDetails = ({name, description, nativeLanguage, targetLanguage}) => {
    return (
        <div>
            <div>
                <span style={{fontSize: '14', color: blue}}>
                  {name}
                </span>
            </div>
            <div>
                <span
                    style={{fontSize: '5', color: blue}}
                >
                    {`Speaks ${nativeLanguage}`}
                </span>{' '}
                <span
                    style={{fontSize: '10', color: blue}}
                >
                    {`Learning ${targetLanguage}`}
                </span>{' '}
            </div>
        </div>
    );
};

Discover.propTypes = {};

export default Discover
