const mongoose = require('mongoose');

// 定义地理空间模型
const geometrySchema = new mongoose.Schema({
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

function getPointCollectionModel(propertySchema){
    const FeatureSchema = new mongoose.Schema({
        type: {
            type: String,
            enum: ['Feature'],
            required: true
        },
        geometry: geometrySchema,
        properties: propertySchema
        // properties: {
        //     FID: Number,
        //     OBJECTID: Number,
        //     UserID: Number,
        //     事件编: String,
        //     具体类: String,
        //     所在位: String,
        //     所在县: String,
        //     所在市: String,
        //     所在省: String,
        //     河湖名: String,
        //     问题发: String,
        //     问题描: String,
        //     问题整: String,
        //     问题类: String,
        //     // 其他属性...
        // }
    });
    
    // 创建模型
    const PointCollectionModel = mongoose.model('PointCollection', FeatureSchema);
    return PointCollectionModel
};

module.exports = getPointCollectionModel;
