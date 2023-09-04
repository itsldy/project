const mongoose = require('mongoose');

// 定义地理空间模型
const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const FeatureSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Feature'],
        required: true
    },
    id: Number,
    geometry: PointSchema,
    properties: {
        FID: Number,
        OBJECTID: Number,
        UserID: Number,
        事件编: String,
        具体类: String,
        所在位: String,
        所在县: String,
        所在市: String,
        所在省: String,
        河湖名: String,
        问题发: String,
        问题描: String,
        问题整: String,
        问题类: String,
        // 其他属性...
    }
});

const FeatureCollectionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['FeatureCollection'],
        required: true
    },
    crs: {
        type: {
            type: String,
            enum: ['name'],
            required: true
        },
        properties: {
            name: String
        }
    },
    features: [FeatureSchema]
});

// 创建模型
const FeatureCollectionModel = mongoose.model('FeatureCollection', FeatureCollectionSchema);

module.exports = FeatureCollectionModel;
