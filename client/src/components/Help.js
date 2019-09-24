import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <div>
        <Button color="dark" size="lg" block onClick={this.toggle}><FontAwesomeIcon icon="question-circle" /> {this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><FontAwesomeIcon icon="question-circle" /> How to play</ModalHeader>
          <ModalBody>
           <div>
               <p>New Game</p>
               <ul>
                   <li><strong>First Player</strong> creates a new Game, by entering a user name, then a Game ID is Created for the game</li>
                   <li><strong>Second Player</strong> Joins Game by Entering a username and the Game ID from player one</li>
               </ul>
               <p>Rules</p>
               <ul>
                   <li><strong>Rock and Scissor -</strong> Rock wins, Rock smashes Scissors</li>
                   <li><strong>Scissors and Papper -</strong> Scissors Cuts paper, Scissors wins</li>
                   <li><strong>Paper and Rock -</strong> Paper Wins, Paper wraps Rock</li>
               </ul>
               <p className="text-center" style={{fontSize: '1.5rem'}}><strong>Enjoy !</strong></p>
           </div>
          </ModalBody>
          <ModalFooter>
            <Button outline color="danger" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Help;