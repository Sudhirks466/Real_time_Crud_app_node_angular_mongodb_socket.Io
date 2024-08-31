const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/realtime-crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a simple schema and model for CRUD
const ItemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model('Item', ItemSchema);

// CRUD APIs
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    io.emit('itemAdded', newItem); // Notify clients of the new item
    res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('itemUpdated', updatedItem); // Notify clients of the update
    res.json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    io.emit('itemDeleted', deletedItem); // Notify clients of the deletion
    res.json(deletedItem);
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
