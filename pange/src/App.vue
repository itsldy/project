<script setup>
import biaoge from './components/biaoge.vue';
import upload from './components/upload.vue';
import { ref } from 'vue';
import axios from 'axios';
import { contentQuotesLinter } from 'ant-design-vue/es/_util/cssinjs/linters';
// 从upload中拿到上传的json赋给sonMessage
const sonMessage = ref(null);
const getSonValue = (value) => {
  sonMessage.value = value;
};
// 解析sonMessage生成表格columns和data
const data = ref([]);
const columns = ref([]);
class columnModel {
  constructor(title, width, dataIndex) {
    this.title = title;
    this.width = width;
    this.dataIndex = dataIndex;
  }
}
class sonMessageParser {
  constructor(sonMessage) {
    this.sonMessage = sonMessage;
  }

  getColumns() {
    try {
      const columntitles = [];
      const num = 0;
      for (let key in this.sonMessage.value[0].properties) {
        columntitles.push(new columnModel(key, 100, key,))
      }
      return columntitles;
    } catch (error) {
      console.error('Error generating Columns:', error);
    }

  }

  async fetchData() {
    try {
      // const response = await fetch('http://127.0.0.1:3000/fetch-data');
      // const data = await response.json();
      // return data
      const response = await axios.get('http://127.0.0.1:3000/fetch-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getData() {
    try {
      const datafrommongo = await this.fetchData();
      const data = [];
      datafrommongo.forEach(element => {
        // 创建一个新对象，不包含 _id 属性
        const newDataItem = { ...element.properties };
        delete newDataItem._id;
        data.push(newDataItem);
      });
      return data;
    } catch (error) {
      console.error('Error Parsing data:', error);
    }
  }
}

async function showProperty() {
  // 在属性表中展示属性
  const tt = new sonMessageParser(sonMessage);
  columns.value = tt.getColumns();
  const datafrommongo = await tt.getData(); // 使用 await 等待数据获取完成
  data.value = datafrommongo;
}

</script>

<template>
  <div class="header">
    <upload class="uper" @getJson="getSonValue"></upload>
    <a-button style="margin-left: 16px;" @click="showProperty">Show Property</a-button>
    <a-button style="margin-left: 16px;">Show Point</a-button>
  </div>
  <biaoge :data="data" :columns="columns"></biaoge>
</template>

<style scoped>
.header {
  display: flex;
}
</style>
