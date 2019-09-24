import React from 'react';
import {Col} from 'reactstrap';
import {Link} from 'react-router-dom';

const Awards = () => {
    return(
        <div>
            <div>
                <h2 className="text-center text-light">404 Not Found</h2>
            </div>
            <Col md={4} className="text-center bg-light p-4 mx-auto" style={{fontSize:'2rem'}}>
                <span role="img" aria-label="happy" style={{fontSize: '5rem'}}>&#x1F620;</span>
                <p>How did you get here, Please Go Back to <Link to='/'>Homepage</Link></p>
            </Col>
        </div>
    )
}

export default Awards;