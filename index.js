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
  console.log('req.files', req.files);
  if(req.files){
    var obj = req.files;
    for(var key in obj) {
        var file = obj[key];
        console.log('file:::', file.name);
        var name = file.name;
        var uploadpath = __dirname + '/client/uploads/' + name;
        file.mv(uploadpath,function(err){
          if(err){
            console.log("File Upload Failed",name,err);
            res.send("Error Occured!")
          }
          else {
            console.log("File Uploaded",name);
            // res.send('Done! Uploading files')
          }
        });
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
  // for(var key in obj) {
  //   console.log('file',key);
  // }
  console.log(Object.keys(obj)[0]);
  fs.unlinkSync(filePath);
});

const testFolder = __dirname + '/client/uploads/';
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    if (file === 'Game SVMobi.rar')
    console.log('Match',file);
  });
})

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
