import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import Awards from './Awards';
import { socket } from './sockets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

class Gamemodal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backdrop: false
    };
    this.playAgain = this.playAgain.bind(this);
    this.newGame = this.newGame.bind(this);
  }
  componentDidMount(){
    socket.on('newGame', this.newGame)
  }
  newGame = (data) => {
   if(data){
     this.props.toggle();
     this.props.hasPlayed();
   }
  }

  playAgain = (data) => {
    socket.emit('playagain', data)
  }

  componentWillUnmount(){
    socket.off('playagain')
    socket.off('newGame')
  }
  render() {
    let award
    if(this.props.gameState.winner){
      if(this.props.gameState.winner === 'draw'){
        award = <Awards draw={"draw"}/>
      }else{
        if(this.props.gameState.winner !== this.props.gameState.currentPlayerPlayed){
          award = <Awards lose={"lose"}/>
        }else{
          award = <Awards win={"win"}/>
        }
      }
    }
    return (
      <div>
        <Modal isOpen={this.props.isOpen} className={this.props.className}>
          <ModalBody>
            <div>
              {award}
              <div className="border p-1">
                <p className="text-center">Game Summary</p>
                <ul>
                  <li><strong>You Played</strong> {this.props.gameState.currentPlayerPlayed}</li>
                  <li><strong>Reason </strong>{this.props.gameState.reason}</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="border border-primary" color="white" outline size="lg"><Link to="/"><FontAwesomeIcon icon="home"/> Home</Link></Button>{ ' ' }
            <Button className="" outline color="primary" onClick={() => this.playAgain(this.props.player.gameid)} size="lg"><span role="img" aria-label="redo">&#8635;</span> Play Again</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Gamemodal;