const express = require('express');
const upload = require('express-fileupload');
const http = require('http');

const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');
http.Server(app).listen(port);
// const server = http.createServer(app).listen(port);
// const server = http.Server(app).listen(port);
// const io = require('socket.io')(server);

app.use(upload()); // configure middleware

console.log("Server Started at port ", port);

app.use(express.static(__dirname + '/client/build'));
app.set('views', './build');
app.use("/node_modules", express.static(__dirname + '/client/node_modules'));
app.use("/uploads", express.static(__dirname + '/client/uploads'));
// app.get('*', function(req, res) {
//   var file = __dirname + '/client/uploads/' + '2.jpg';
//   console.log('trololo', file);
//   // console.log('trololo2', req.name);
//   // res.download(__dirname + '/client/uploads/1.jpg');
// });
app.get('*', function (req, res) {
  res.sendFile(`${process.cwd()}/client/build/index.html`)
});
app.post('/', function(req,res){
  // console.log('req.files', req.files);
  if(req.files){
    var obj = req.files;
    for(var key in obj) {
      var file = obj[key];
      console.log('file:::', file.name);
      var name = file.name;
      var dir = __dirname + '/client/uploads/';
      var uploadpath = dir + name;
      var copy = false;
      var itemsProcessed = 0;

      fs.readdir(dir, (err, files) => {
        files.forEach(curfile => {
          itemsProcessed++;
          if (curfile === name) {
            copy = true;
            // console.log('copy',copy);
          }
          if(itemsProcessed === files.length) {
            callback();
          }
        });
      });
      // console.log('copy2',copy);
      function callback () {
        if (copy === true) {
          // console.log('Match',name);
          res.status(500);
          res.write(name);
          res.end()
        } else {
          file.mv(uploadpath,function(err){
            if(err){
              console.log("File Upload Failed",name,err);
              res.send("Error Occured!")
            }
            else {
              console.log("File Uploaded",name);
              // res.status(500);
              // res.write(name);
              res.end()
            }
          });
        }
      }
      // if (!fs.existsSync(dir)){
      //   fs.mkdirSync(dir);
      // }
    }
  }
  else {
    res.send("No File selected !");
    res.end();
  };
});
app.post('/del', function(req,res){
  console.log('req.body',req.body);
  var obj = req.body;
  var filename = Object.keys(obj)[0];
  var filePath = __dirname + '/client/uploads/' + filename;
  var dir = __dirname + '/client/uploads/';
  // console.log(Object.keys(obj)[0]);
  fs.unlinkSync(filePath);
  // fs.readdir(dir, function(err, files) {
  //   if (err) {
  //      // some sort of error
  //   } else {
  //     if (!files.length) {
  //       fs.rmdirSync(dir);
  //     }
  //   }
  // });
});

// io.on('connection', function (socket) {
//
//   // io.sockets.emit('notification', { title: 'Hello the world' });
//   // socket.on('my other event', function (data) {
//   //   console.log(data);
//   // });
//   io.sockets.emit('notification', () => {
//     console.log('user disconnected');
//   });
// });
