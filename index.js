require('dotenv').config();

const express = require('express');
const path = require("path");
const fs = require('fs');
const multer = require("multer");
const bodyParser = require('body-parser');

const app = express();
const upload = multer({ dest: "public/media/" });

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Allow to parse JSON data from the request body

app.get('/', (req, res) => {
    res.render(__dirname + '/view/index');
});

// Handle the saving of JSON data
app.post('/saveData', (req, res) => {
    try {
        const jsonData = req.body;
        const filePath = 'public/data.json';
        const jsonString = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
        res.status(200).send('Changes saved successfully.');
    } catch (error) {
        console.error('Error saving changes:', error);
        res.status(500).send('Error saving changes.');
    }
});

// Handle deleting a media from JSON data file and from media directory
app.post('/deleteMedia', (req, res) => {
    const mediaSourceToDelete = req.body.mediaSourceToDelete;
    // Read the existing JSON file
    fs.readFile('public/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).send('Error reading data.json');
        }
        try {
            let mediaS = JSON.parse(data);
            // Find the index of the object to delete
            let indexToDelete = mediaS.findIndex(item => {
                return item.mediaSource.replace(/^.*[\\\/]/, '') === mediaSourceToDelete;
            });
            if (indexToDelete !== -1) {
                mediaS.splice(indexToDelete, 1); // Remove the object from the array
                // Write the modified JSON back to the file
                fs.writeFile('public/data.json', JSON.stringify(mediaS), 'utf8', writeErr => {
                    if (writeErr) {
                    console.error('Error writing data.json:', writeErr);
                    return res.status(500).send('Error writing data.json');
                    }
                    // delete from media directory
                    deleteFile(mediaSourceToDelete);
                    res.status(200).send('Object deleted successfully.');
                });
            } else {
                res.status(404).send('Object not found.');
            }
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send('Error parsing JSON');
        }
    });
});

function deleteFile(filename) {
    const filePath = path.join(__dirname, 'public', 'media', filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            // File deleted successfully
        }
    });
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
            // Changes saved successfully
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
        // File copied successfully
        res.sendStatus(200);
    });
});

const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
    console.log('Server started on port 3000');
});