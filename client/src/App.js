import React from 'react';
import { BrowserRouter as Router, //Link,*/
   Route, Switch } from 'react-router-dom';
import { Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Select from './components/Select';
import Create from './components/Create';
import Join from './components/Join';
import Game from './components/Game.js';
import Notfound from './components/Notfound';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faQuestion, faUserFriends, faUserPlus, faUserCircle, faAtom, faUser, faHome, faHandPaper, faHandRock, faHandScissors} from '@fortawesome/free-solid-svg-icons'

library.add(faQuestionCircle, faQuestion, faUserFriends, faUserPlus, faUserCircle, faAtom, faUser, faHome, faHandPaper, faHandRock, faHandScissors)


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      auth: false
    }

    this.playerUpdater = this.playerUpdater.bind(this);
    this.gameUpdater = this.gameUpdater.bind(this);
  
  }
  playerUpdater = (key,val) => {
      this.setState({
        [key]: val,
        auth: !this.state.auth
      })
  }

  gameUpdater = (key, val) => {
    this.setState({
      [key]: val
    })
  }

  render(){
    return(
      <div className="">
        <Router>
            <Col>
              <div className="router">
                <Switch>
                  <Route 
                    exact path="/" 
                    render={props => <Select {...props} appState={this.state} gameUpdater={this.gameUpdater} />}
                  />
                  <Route 
                    path="/create" 
                    render={props => <Create {...props} appState={this.state} playerUpdater={this.playerUpdater} gameUpdater={this.gameUpdater}/>}
                  />
                  <Route 
                    path="/join" 
                    render={props => <Join {...props} appState={this.state} playerUpdater={this.playerUpdater} gameUpdater={this.gameUpdater}/>}
                  />
                  <Route 
                    path="/game" 
                    render={props => <Game {...props} appState={this.state} gameData={this.state.gameData} auth={this.state.auth} playerUpdater={this.playerUpdater} gameUpdater={this.gameUpdater}/>}
                  />
                  <Route 
                    render={props => <Notfound {...props}/>}
                  />
                </Switch>
              </div>
            </Col>
        </Router>
        <footer>
          <div className="text-center mt-4">
            <small>Created by Godwin Agedah ALCRivers<br/>
            <a href="https://twitter.com/GodwinAgedah">Twitter |</a> <a href="https://godwinagedah.com.ng/" >Web |</a><br/>
            Powered by React <FontAwesomeIcon icon="atom" /> and Socket.io
            <br/>&copy; 2019</small>
          </div>
        </footer>
      </div>
    )
  }

}

export default App;
