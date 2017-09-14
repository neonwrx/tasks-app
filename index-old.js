const express = require('express');
const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'client/uploads/' });

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.set('views', './build');
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')));
app.use("/uploads", express.static(path.join(__dirname, 'client/uploads')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.post('/', upload.any(), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log(`App listening on ${port}`);
