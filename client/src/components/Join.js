import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {join, socket} from './sockets';

class Join extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        playertwo_username: '',
        gameid: '',
        submit: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.joinHandler = this.joinHandler.bind(this);
    this.error = this.error.bind(this);
  }

    componentDidMount(){
      socket.on('begin', this.handleBegin);
      socket.on('errormsg', this.error);
    }

    componentWillUnmount(){
      socket.off('errormsg', this.error);
      socket.off('begin', this.handleBegin);
    }

    handleBegin = (data) => {
      if(data === true){
        this.props.playerUpdater('playertwo',this.state.playertwo_username);
        this.props.gameUpdater('gameid', this.state.gameid);
        this.props.history.push('/game');
      }
    }

    error = (data) => {
      this.setState({error: data})
    }


    handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
    }

    joinHandler =(e) => {
      e.preventDefault();
      if((this.state.playertwo_username !== '') && (this.state.gameid !== '')){
      join({...this.state});
      this.setState({submit: true})
      }else{
        this.error('You can\'t submit an Empty field!' )
      }
    }


  render(){
    return(
      <div>
        <Col md={4} className="mx-auto p-0 mt-5">
          <h2 className="text-center text-light">JOIN GAME</h2>
          <Form onSubmit={this.joinHandler} className="bg-white p-4 rounded">
            <p className="text-center text-secondary">Enter Username and Game ID to Join a created game</p>
            <div>
              {(this.state.error) ? (<small className="text-danger" ><span role="img" aria-label="stop">&#9940;</span> {this.state.error}</small>) : null}
            </div>
            <FormGroup>
            <Label for="playertwo_username" className="d-none">username</Label>
            <Input type="text" name="playertwo_username" id="playertwo_username" placeholder="Username" onChange={this.handleChange} value={this.state.playertwo_username} autoComplete="off"/>
            </FormGroup>
            <FormGroup>
            <Label for="gameid" className="d-none">gameid</Label>
            <Input type="text" name="gameid" id="gameid" placeholder="Game ID" onChange={this.handleChange} value={this.state.gameid} autoComplete="off"/>
            </FormGroup>
            <Button block color="dark">ENTER</Button>
          </Form>
        </Col>
      </div>
    );
  }
}

export default Join;
