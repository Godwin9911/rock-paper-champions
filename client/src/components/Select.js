import React from 'react';
import { Button,Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, {keyframes} from 'styled-components';
import { bounce } from 'react-animations';
import Help from './Help';

const Bounce = styled.div`animation: 2s ${keyframes`${bounce}`}`;

class Select extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }
 
  create = () => {
    this.props.history.push('/create')
  }

  join = () => {
    this.props.history.push('/join')
  }

  render(){
    return(
      <div className="text-center">
        <div>
          <Bounce className="text-light mt-4">
            <h1>Rock Paper Champions</h1>
          </Bounce>
        </div>
        <Col md={4} className="bg-white mx-auto p-4 rounded">
          <p className="text-secondary">Create a game or join an already created Game.<br/> Best Played with a friend</p>
          <div className="m-4">
            <Button onClick={this.create}  color="dark" size="lg" block><FontAwesomeIcon icon="user-friends" /> Create Game</Button>
          </div>
          <div className="m-4">
            <Button onClick={this.join}  color="dark" size="lg" block><FontAwesomeIcon icon="user-plus" /> Join Game</Button>
          </div>
          <div className="m-4">
            <Help buttonLabel={'How to Play'}/>
          </div>
        </Col>
      </div>
    )
  }

}

export default Select;
