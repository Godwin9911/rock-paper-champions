import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Spinner} from 'reactstrap';
import {create, socket} from './sockets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Create extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        submit: false,
        gameCreated: false,
        playerone_username:''
    }

    this.handleChange = this.handleChange.bind(this);
    this.createHandler = this.createHandler.bind(this);

  }

  componentDidMount(){
    socket.on('begin', this.handleBegin);
    socket.on('gameCreated', this.gameCreated);
    this.setState({gameid: Math.floor((Math.random() * 5000) + 1000)})
  }

  gameCreated = (data) => {
    if(data === true){
      this.setState({gameCreated: data});
    }else{
      this.setState({error: 'Game could not be created'})
    }
  }
  handleBegin = (data) => {
    if(data === true){
      this.props.playerUpdater('playerone',this.state.playerone_username);
      this.props.gameUpdater('gameid', this.state.gameid);
      this.props.history.push('/game');
    }
  }
  handleChange = (e) => {
    this.setState({playerone_username: e.target.value})
  }
  createHandler = (e) => {
      e.preventDefault();
      if((this.state.playerone_username !== '') && (this.state.gameid !== '')){
        create({...this.state});
        this.setState({submit: true})
      }else{
        this.setState({error: 'Please Enter your username'});
      }
  }
  componentWillUnmount(){
    socket.off('begin');
    socket.off('gameCreated');
  }


  render(){
    return(
      <div className="mt-5">
          {(!this.state.submit && !this.state.gameCreated) ?
          (<Col md={4} className="mx-auto p-0">
            <h2 className="text-center text-white">CREATE GAME</h2>
            <Form onSubmit={this.createHandler} className="bg-white p-4 rounded">
              <p className="text-center text-secondary">Enter username to create game</p>
              <div>{(this.state.error) ? (<small className="text-danger"><span role="img" aria-label="stop">&#9940;</span> {this.state.error}</small>) : null}</div>
            <FormGroup>
              <Label for="playerone_username" className="d-none">username</Label>
              <Input type="text" name="playerone_username" id="playerone_username" placeholder="Username" onChange={this.handleChange} value={this.state.playerone_username} autoComplete="off"/>
            </FormGroup>
            <Button color="dark" block>ENTER</Button>
          </Form>
          </Col>
          ):(
            <div>
              <h2 className="text-center text-white">GAME DETAILS</h2>
              <Col md={4} className="text-center bg-white p-2 mx-auto rounded">
                <h3>Game ID: {this.state.gameid}</h3>
                <h4><FontAwesomeIcon icon="user" /> {this.state.playerone_username}</h4>
                <p className="text-secondary">Second player should Enter game ID to join the Game</p>
                <div className="mt-5">
                  <Spinner color="primary"/><br/>
                  <small> Waiting for second Player...</small>
                </div>
              </Col>
            </div>
          )}
      </div>
    );
  }
}

export default Create;
