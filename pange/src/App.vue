<script setup>
import biaoge from './components/biaoge.vue';
import upload from './components/upload.vue';
import { ref } from 'vue';
import axios from 'axios';
// 从upload中拿到上传的json赋给sonMessage
const sonMessage = ref(null);
const getSonValue = (value) => {
  sonMessage.value = value;
};
// 解析sonMessage生成表格columns和data
const data = ref([]);
const columns = ref([]);
class columnModel {
  constructor(title, width, dataIndex, key) {
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
    const columntitles = [];
    const num = 0;
    for (let key in this.sonMessage.value[0].properties) {
      columntitles.push(new columnModel(key, 100, key,))
    }
    return columntitles
  }

  getData() {

  }
}

async function fetchData() {
  try {
    const response = await fetch('http://127.0.0.1:3000/fetch-data');
    const data = await response.json();
    populateTable(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function showProperty() {
  // 在属性表中展示属性
  const tt = new sonMessageParser(sonMessage);
  columns.value = tt.getColumns();
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
