import React from 'react';
import {socket} from './sockets';
import {Spinner, Row, Col, Button, Card, CardFooter, CardBody,CardHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Gamemodal from './Gamemodal';
import styled, {keyframes} from 'styled-components';
import { fadeIn } from 'react-animations';

const BounceIn = styled.div`animation: 1s ${keyframes`${fadeIn}`}`;

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false,
      hasPlayed: false
    }
    this.play = this.play.bind(this);
    this.showModal = this.showModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.hasPlayed = this.hasPlayed.bind(this);
}

toggle = () => {
  this.setState({
    isModalOpen: !this.state.isModalOpen
  })
}

hasPlayed = () => {
  this.setState({
    hasPlayed: !this.state.hasPlayed
  })
} 

showModal = () => {
  this.setState({
    isModalOpen: true
  });
}

play = (val) => {
  //set what the player played locally
  this.setState({currentPlayerPlayed: val}, this.hasPlayed())
  //send play value to backend
  if(this.props.appState.playerone){
    //playerone
    socket.emit('playeroneplay', {playeroneplay: val, gameid: this.props.gameData.gameid})

  }else if(this.props.appState.playertwo){
    //playertwo
    socket.emit('playertwoplay', {playertwoplay: val, gameid: this.props.gameData.gameid})

  }else{
    console.log('no props available')
  }
}

componentDidMount(){
  //send game id to backend to bring players data
  socket.on('gameData', this.gameData);
  //get winners 
  socket.on('winner', this.winner);
  //General messaging
  socket.on('msg', this.msg); 
  if(this.props.auth === false){
    this.props.history.push('/');
  }
}

gameData = (data) => {
  this.props.gameUpdater('gameData',data.doc[0]);
}

winner = (data) => {
    let find = this.findWinner(data.playeroneplay, data.playertwoplay);
    this.setState({
      winner: find.winner,
      reason: find.reason
    }, this.toggle)
}

findWinner = (playeroneplay, playertwoplay) => {
    //if both players make different choices
    if(playeroneplay !== playertwoplay){
  
      if((playeroneplay === 'rock' && playertwoplay === 'scissors') || ((playeroneplay === 'scissors' && playertwoplay === 'rock'))){
        
        return ({winner: 'rock', reason: 'Rock Smash Scissors'});     
  
      }else if((playeroneplay === 'rock' && playertwoplay === 'paper') || (playeroneplay === 'paper' && playertwoplay === 'rock')){
  
        return ({winner: 'paper', reason: 'Paper wrap rock'});
    
      }else if((playeroneplay === 'scissors' && playertwoplay === 'paper') || (playeroneplay === 'paper' && playertwoplay === 'scissors')){
  
        return ({winner: 'scissors', reason: 'scissors cut paper'});
      }
    }else{
  
      return({winner: 'draw', reason: 'Both Players Made the same decision'});
      
    }
}

msg = (data) => {
  this.setState({msg: data});
}

componentWillUnmount(){
  //send game id to backend to bring players data
  socket.off('gameData', this.gameData);
  //get winners 
  socket.off('winner', this.winner);
  //General messaging
  socket.off('msg', this.msg);
}

  render(){
    return(
      <Col md={5} className="mx-auto p-0 bg-light mt-3">
        <Gamemodal
          isOpen={this.state.isModalOpen} 
          toggle={this.toggle}
          gameState={this.state}
          player={this.props.appState.gameData} 
          hasPlayed={this.hasPlayed}
        />
          <div>
            <Card>
              <CardHeader tag="h6" className='bg-dark rounded text-light'>
                <Row>
                  <Col className="p-0">
                    {(this.props.gameData) ? (<p className="pl-2 m-0"><FontAwesomeIcon icon="user-circle" /> Player 1<br/><small>{this.props.gameData.playerone}</small></p>) : null}
                  </Col>
                  <Col className="p-0 pl-0">
                    {(this.props.gameData) ? (<p className="p-0 m-0 text-right">Player 2 <FontAwesomeIcon icon="user-circle" /><br/><small>{this.props.gameData.playertwo}</small></p>) : null}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="pt-1-sm">
                <div>
                {
                  (this.props.gameData) ? 
                  (
                  <div>
                    <div>
                      <p>{this.props.gameData.playerone} created game</p>
                      <p>{this.props.gameData.playertwo} Joined game</p>
                      <p className="text-primary">{(this.state.msg) ? (this.state.msg) : 'Game Started...'}</p>
                    </div>
                    <BounceIn>
                      <Row id="playarea" className={this.state.hasPlayed ? "d-none" : ""}>
                        <Col lg={4} className="mt-4 p-1">
                          <Button outline color="dark"  className="h-100" block size="lg" onClick={() => this.play('rock')}><FontAwesomeIcon icon="hand-rock"/> Rock</Button>
                        </Col>
                        <Col lg={4} className="mt-4 p-1">
                          <Button outline color="dark"  className="h-100" block size="lg" onClick={() => this.play('paper')}><FontAwesomeIcon icon="hand-paper"/> Paper</Button>
                        </Col>
                        <Col lg={4} className="mt-4 p-1">
                          <Button outline color="dark" className="h-100" block size="lg" onClick={() => this.play('scissors')}><FontAwesomeIcon icon="hand-scissors"/> Scissors</Button>
                        </Col>
                      </Row>
                    </BounceIn>
                    <BounceIn className={this.state.hasPlayed ? "" : "d-none"}>
                      <Row>
                        <Col className="border">
                          <div className="text-center">
                            <p className="display-4"><FontAwesomeIcon icon={`hand-${this.state.currentPlayerPlayed || 'rock'}`}/><br/> You Played<br/> {this.state.currentPlayerPlayed}</p>
                            <Spinner type="grow" color="primary" />
                            <p>Waiting for other Player...</p>
                          </div>
                        </Col>
                      </Row>
                    </BounceIn>
                  </div>
                  )
                  : 
                  <div>
                    <div className="mt-5 p-2 text-center">
                      <div>
                        <Spinner color="info"/><br/>
                        <small> Loading Game, Please wait...</small>
                      </div>
                    </div>
                  </div>
                }
              </div>
              </CardBody>
              <CardFooter>
                <p><strong>{this.props.appState.playerone || this.props.appState.playertwo}</strong></p>
              </CardFooter>
            </Card>
          </div>
      </Col>
    );
  }
}

export default Game;
