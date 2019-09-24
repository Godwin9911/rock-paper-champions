import React from 'react';

const Awards = (props) => {
    if(props.win){
        return (
            <div className="text-center text-success">
                <span role="img" aria-label="happy" style={{fontSize: '5rem'}}>&#128512;</span>
                <p className="display-4">YOU WIN!</p>
                <p>Victory, you're Awesome</p>
            </div>
        )
    }else if(props.draw){
        return (
            <div className="text-center text-secondary">
                <span role="img" aria-label="neutral"  style={{fontSize: '5rem'}}>&#128527;</span>
                <p className="display-4">GAME DRAWN!</p>
                <p>Truce, No Winner</p>
            </div>
        )

    }else if(props.lose){
        return (
            <div className="text-center text-danger">
                <span role="img" aria-label="sad"  style={{fontSize: '5rem'}}>&#128557;</span>
                <p className="display-4">YOU LOSE!</p>
                <p>Better Luck Next Time</p>
            </div>
        )
    }else{
        return null;
    }
}

export default Awards;