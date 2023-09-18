<!-- 使用的ant表格组件 -->
<template>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
    </a-table>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
});
</script>