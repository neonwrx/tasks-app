const express = require('express');
var app = express();
var upload = require('express-fileupload');
const http = require('http');
http.Server(app).listen(8000); // make server listen on port 8000

app.use(upload()); // configure middleware

console.log("Server Started at port 8000");

// app.get('/',function(req,res){
//   res.sendFile(__dirname+'/index.html');
// })
app.use(express.static(__dirname + '/client/build'));
app.set('views', './build');
app.use("/node_modules", express.static(__dirname + '/client/node_modules'));
app.use("/uploads", express.static(__dirname + '/client/uploads'));
app.get('/', function (req, res) {
  res.sendFile(`${process.cwd()}/client/build/index.html`)
});
app.post('/',function(req,res){
  console.log(req.files);
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
})
