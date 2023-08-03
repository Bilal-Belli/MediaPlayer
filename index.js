const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser'); // Add this line

const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "public/media/" });

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
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
}

app.post("/saveNewData", (req, res) => {
    const filePath = 'public/data.json';
    const newJsonObjects = req.body;
    // Read the existing data from the file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        let existingData = [];
        try {
            existingData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Error parsing JSON");
        }
        // Add new JSON objects to existing data
        existingData.push(newJsonObjects);
        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
            console.error("Error writing file:", writeErr);
            return res.status(500).send("Error writing file");
            }
            console.log("Changes saved successfully.");
            res.sendStatus(200);
        });
    });
});

app.post("/copyFile", upload.single("file"), (req, res) => {
    const uploadedFile = req.file;
    const targetDirectory = path.join(__dirname, "public", "media"); // Change to your desired directory
    // Move the uploaded file to the target directory
    const targetPath = path.join(targetDirectory, uploadedFile.originalname);
    fs.rename(uploadedFile.path, targetPath, (err) => {
        if (err) {
            console.error("Error copying file:", err);
            return res.status(500).send("Error copying file");
        }
        console.log("File copied successfully.");
        res.sendStatus(200);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});