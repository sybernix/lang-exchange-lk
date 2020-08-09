import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { useGetUsers } from '../../Services/userService';

const Discover = props => {
    const getUsers = useGetUsers();

    // console.log({getUsers});

    useEffect(() => {
        getUsers().then(res => console.log(res));
    }, null);

    return (
        <div>
            {/*console.log(getUsers.getUsers());*/}
            {/*getUsers().then(res => setUsers(res));*/}
            <h3>Welcome to Discover Page</h3>
            <Link to="/chat">chat</Link>
        </div>
    )
}

Discover.propTypes = {

}

export default Discover

// import React, {Component} from 'react';
// import {Link} from "react-router-dom";
// import { useGetUsers } from '../../Services/userService';
//
// class Discover extends Component {
//
//     componentDidMount() {
//         useGetUsers((response) => {
//             console.log(response);
//         });
//     }
//
//     render() {
//         return (
//             <div>
//                 <h3>Welcome to Discover Page</h3>
//                 <Link to="/chat">chat</Link>
//             </div>
//         );
//     }
// }
//
// export default Discover;