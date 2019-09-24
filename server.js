const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({filename: './datafile', autoload: true});

const PORT = process.env.PORT || 5000

let users = [];

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))


io.on('connection', function(socket){
    users.push(socket.id)
    console.log(`${users.length} users connected`);

    const determineWinner = (room, playeroneplay, playertwoplay) => {
      io.sockets.in(`${room}`).emit('winner', {room, playeroneplay, playertwoplay});
    }

    socket.on('create', function(data) {
      //TODO Ensure a room can't be created twice
      let game = {}
      game.gameid = data.gameid
      game.playerone = data.playerone_username;
      game.roomtotal = 1;
      game.socket = socket.id;
      db.insert(game, (err, newDoc) => {
        (err) => console.log(err)
        //join room
       socket.join(`${game.gameid}`);
       //send game created info
       io.sockets.in(`${game.gameid}`).emit('gameCreated', true);

      })
    });

    socket.on('joinGame', function(data){
      let gameid = parseInt(data.gameid)
      db.update({gameid: gameid, roomtotal:1},{$set: {playertwo: data.playertwo_username, roomtotal:2, socket: socket.id}}, {}, (err, doc) => {
        if(err) throw err;
        if(doc){
          //Join Game Room
          socket.join(`${gameid}`);
          //begin game
          io.sockets.in(`${gameid}`).emit('begin', true);
          db.find({gameid: gameid}, (err, doc) =>{
            if(err) throw err;
            if(doc){
              //send game data
              io.sockets.in(`${gameid}`).emit('gameData', {doc});
            }
          })
        }else{
          //Room doesn't Exist
          socket.emit('errormsg', `Game ID: ${gameid} doesn't exist, Try creating a new game`)
        }
      })
    });

    socket.on('playeroneplay', function(data){
      let gameid = parseInt(data.gameid);

      db.update({gameid: gameid},{$set: {playeroneplay: data.playeroneplay}}, {}, (err, doc) =>{
        if(err) throw err;
        if(doc){
          //check if player two have played
          db.findOne({gameid: gameid},(err, doc) => {
            if (err) throw err;
            if(doc.playertwoplay){
              //true
              //console.log(`${doc.playertwo} has played...`)
              determineWinner(doc.gameid, doc.playeroneplay,  doc.playertwoplay);
            }else{
              //send message to frontend
              io.sockets.in(`${doc.gameid}`).emit('msg',`Waiting for ${doc.playertwo} to play...` )
              //console.log(`Waiting for ${doc.playertwo}...`)
            }
          })
        }
      })
    })

    socket.on('playertwoplay', function(data){
      let gameid = parseInt(data.gameid);

      db.update({gameid: gameid},{$set: {playertwoplay: data.playertwoplay}}, {}, (err, doc) =>{
        if(err) throw err;
        if(doc){
          //check if player two have played
          db.findOne({gameid: gameid},(err, doc) => {
            if (err) throw err;
            if(doc.playeroneplay){
              //true
             // console.log(`${doc.playerone} has played...`)
              determineWinner(doc.gameid, doc.playeroneplay,  doc.playertwoplay);
            }else{
              //send message to frontend
              io.sockets.in(`${doc.gameid}`).emit('msg',`Waiting for ${doc.playerone} to play...` )
              //console.log(`Waiting for ${doc.playerone}...`)
            }
          })
        }
      })
    })

    socket.on('playagain', function(data){
      let gameid = parseInt(data);

      //check if previous player has reset the game already
      db.findOne({gameid: gameid}, (err, doc)=>{
        if(doc.playeroneplay === 0 || doc.playertwoplay === 0){
          //game already restarted
          //Trigger play again in client
          socket.emit('newGame',true);
          //reset game
        }else{
          db.update({gameid: gameid},{$set: {playeroneplay: 0, playertwoplay: 0}}, {}, (err, doc) =>{
            if(err) throw err;
            if(doc){
              //Trigger play again in client
              socket.emit('newGame',true);
              io.sockets.in(`${gameid}`).emit('msg',`New Game Started, play Again...` );
            }
          })
        }
      })
    })

    socket.on('disconnect', function(){
      users.splice(socket.id, 1);
      db.remove({socket: socket.id}, {}, function(err, doc){
        if(doc){
          console.log(`NumRemoved ${doc}`)        
          console.log(`user disconnected, ${users.length} left`);
        }
      })
    });
});


// stuff that gave me problems
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

http.listen(PORT, () => {console.log(`listening on ${5000}`);})
