const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser'); // Add this line

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Add this line to parse JSON data from the request body

app.get('/', (req, res) => {
    res.render(__dirname + '/view/index');
});

// New route to handle the saving of JSON data
app.post('/saveData', (req, res) => {
    try {
        const jsonData = req.body;
        saveDataToFile(jsonData);
        res.status(200).send('Changes saved successfully.');
    } catch (error) {
        console.error('Error saving changes:', error);
        res.status(500).send('Error saving changes.');
    }
});

function saveDataToFile(jsonData) {
    const filePath = 'public/data.json';
    const jsonString = JSON.stringify(jsonData, null, 2); // The third argument is for pretty printing.
    fs.writeFileSync(filePath, jsonString, 'utf8');
}

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});