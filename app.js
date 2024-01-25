const express = require('express');
const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/contactsDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Define a Contact schema
const contactSchema = new mongoose.Schema({
    name: String, number: Number, address: String
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});


// API endpoint to get all contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// API endpoint to add a new contact
app.post('/api/contacts', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();

        res.send('Contact added successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get contact by id
app.get('/api/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await Contact.findById(id);
        res.json(contact);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// update contact by id
app.post('/api/edit-contact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        Contact.findOneAndUpdate({_id: id}, {
            $set: {
                name: req.body.name, number: req.body.number, address: req.body.address
            }
        }, {new: true}).then((contact) => {
            if (!contact) {
                return res.status(404).send();
            }
            res.send(contact);
        }).catch((error) => {
            res.status(500).send(error);
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/delete-contact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Contact.findByIdAndDelete(id);
        res.send('Contact deleted successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
