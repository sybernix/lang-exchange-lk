import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

const Discover = props => {
    return (
        <div>
            <h3>Welcome to Discover Page</h3>
            <Link to="/chat">chat</Link>
        </div>
    )
}

Discover.propTypes = {

}

export default Discover
