const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Buraya senin MongoDB linkini koydum patron!
const mongoURI = "mongodb+srv://muhammedmiracozkan06_db_user:VJTGpHsVFdi8BWKC@cluster0.n4256fw.mongodb.net/NeuraMaxDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('Neura Buluta Bağlandı!'))
  .catch(err => console.log('Hata:', err));

const Chat = mongoose.model('Chat', {
  title: String,
  messages: Array,
  date: { type: Date, default: Date.now }
});

app.get('/', (req, res) => res.send('Neura MAX Sunucusu Çalışıyor!'));

app.post('/save', async (req, res) => {
  const newChat = new Chat(req.body);
  await newChat.save();
  res.send({ status: "Tamamdır!" });
});

app.get('/history', async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
});

app.listen(process.env.PORT || 3000);
