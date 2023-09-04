const express = require('express');
const mongoose = require('mongoose');
// const fs = require('fs');
const FeatureCollectionModel = require("./pointmodel");//mongo模型
const cors = require('cors');//跨域
const multer = require('multer'); // 用于处理文件上传
// const bodyParser = require('body-parser'); // 用于解析请求体

const app = express();
const port = 3000;

// 连接数据库
mongoose.connect('mongodb://127.0.0.1/newgeojson_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

app.use(cors({
  origin: 'http://127.0.0.1:5500' // 允许来自此域的请求
}));

// 设置文件上传存储配置
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 使用 body-parser 解析请求体
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.post('/upload', upload.single('jsonFile'), async (req, res) => {
  try {
    // 解析上传的 JSON 数据
    const geojsonData = JSON.parse(req.file.buffer.toString());
    const featureCollection = new FeatureCollectionModel(geojsonData);
    await featureCollection.save()
      .then(savedData => {
        console.log('Data saved:', savedData);
      })
      .catch(error => {
        console.error('Error saving data:', error);
      });
    mongoose.disconnect();
    res.json({ message: 'User data uploaded and saved.' });
  } catch (error) {
    console.error('Error uploading and saving JSON:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
})

app.get('/fetch-data', async (req, res) => {
  try {
      const featureCollection = await FeatureCollectionModel.find();
      res.json(featureCollection[0].features);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred.' });
  }
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

