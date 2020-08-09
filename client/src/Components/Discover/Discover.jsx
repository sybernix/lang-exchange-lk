import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGetUsers } from '../../Services/userService';

const Discover = props => {
    const [users, setUsers] = useState([]);
    const getUsers = useGetUsers();

    // function onResponse(res) {
    //     setUsers(res);
    //     console.log(users);
    // }

    useEffect(() => {
        getUsers().then(res => setUsers(res));
    }, []);

    useEffect(() => {
        console.log(users);
    });

    return (
        <div>
            <h3>Welcome to Discover Page</h3>
            <Link to="/chat">chat</Link>
        </div>
    )
};

Discover.propTypes = {

};

export default Discover
