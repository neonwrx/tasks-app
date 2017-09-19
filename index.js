const express = require('express');
const upload = require('express-fileupload');
const http = require('http');

const app = express();
const port = process.env.PORT || 8000;
http.Server(app).listen(port);

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
