const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render(__dirname + '/view/index');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});