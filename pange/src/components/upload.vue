<template>
    <div class="clearfix" style="display: flex; align-items: center;">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove" style="margin-right: 16px;">
            <a-button>
                <upload-outlined></upload-outlined>
                Select File
            </a-button>
        </a-upload>
        <a-button type="primary" :disabled="fileList.length === 0" :loading="uploading" @click="handleUpload" >
            {{ uploading ? 'Uploading' : 'Start Upload' }}
        </a-button>
    </div>
</template>
  
<script>
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref,defineEmits } from 'vue';
export default defineComponent({
    components: {
        UploadOutlined,
    },
    emits:['getJson'],
    setup(props, { emit }) {
        const fileList = ref([]);
        const uploading = ref(false);
        const jsonData = ref();
        const fieldName = ref(null); // 用于存储fieldName
        
        const handleRemove = (file) => {
            const index = fileList.value.indexOf(file);
            const newFileList = fileList.value.slice();
            newFileList.splice(index, 1);
            fileList.value = newFileList;
        };

        const beforeUpload = (file) => {
            fileList.value = [...fileList.value, file];
            fieldName.value = file.name; // 存储文件名
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileContent = event.target.result;  // 文件内容在这里
                try {
                    jsonData.value = JSON.parse(fileContent);
                } catch (error) {
                    // 处理解析JSON时的错误  
                    console.error("无法解析JSON文件:", error);
                }
            };
            reader.readAsText(file);
            return false;
        };

        const submitData = () => {
            emit("getJson",jsonData.value);
        };

        const handleUpload = async () => {
            const formData = new FormData();
            // const fieldName = 'geojsonfile';
            const currentFieldName = fieldName.value; // 获取当前的fieldName
            fileList.value.forEach(file => {
                formData.append(currentFieldName, file);
            });
            uploading.value = true;
            // AJAX 
            try {
                await axios.post(`http://127.0.0.1:3000/upload/${currentFieldName}`, formData);
                fileList.value = [];
                uploading.value = false;
                // emit("getJson",jsonData.value);
                submitData();
                message.success('Upload successfully.');
            } catch (error) {
                uploading.value = false;
                message.error('Upload failed.');
                console.error('Error uploading JSON:', error);
            }
        };

        return {
            fileList,
            uploading,
            handleRemove,
            beforeUpload,
            handleUpload,
        };
    },
});
</script>