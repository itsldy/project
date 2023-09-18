const express = require('express');
const mongoose = require('mongoose');
// const fs = require('fs');
const generateSchemaFromGeoJSON = require("./getPropertiesSchema")
const getPointCollectionModel = require("./pointmodel");//mongo模型
const cors = require('cors');//跨域
const multer = require('multer'); // 用于处理文件上传
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
  origin: 'http://localhost:5173' // 允许来自此域的请求
}));

// 设置文件上传存储配置
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let PointCollectionModel;

app.post('/upload/:fieldName', (req, res) => {
  const fieldName = req.params.fieldName; // 获取动态字段名
  // console.log(fieldName);
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'An error occurred.' });
    }

    // 继续处理上传的文件
    const geojsonData = JSON.parse(req.file.buffer.toString());
    // console.log(geojsonData[0]);
    const generateSchemaSchema = generateSchemaFromGeoJSON(geojsonData);
    PointCollectionModel = getPointCollectionModel(generateSchemaSchema);
    // 使用 Promise.all 来等待所有保存操作完成后再发送响应
    Promise.all(geojsonData.map(element => {
      const featureCollection = new PointCollectionModel(element);
      return featureCollection.save();
    }))
      .then(savedData => {
        // console.log('Data saved:', savedData);
        res.json({ message: 'User data uploaded and saved.' });
      })
      .catch(error => {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'An error occurred.' });
      });
  });
})

// 前端拉数据库中的数据进行展示
app.get('/fetch-data', async (req, res) => {
  try {
    if (!PointCollectionModel) {
      return res.status(500).json({ error: 'PointCollectionModel not available.' });
    }
    const featureCollection = await PointCollectionModel.find();
    res.json(featureCollection);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
