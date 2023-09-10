<template>
    <div class="clearfix" style="display: flex; align-items: center;">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove" style="margin-right: 16px;">
            <a-button>
                <upload-outlined></upload-outlined>
                Select File
            </a-button>
        </a-upload>
        <a-button type="primary" :disabled="fileList.length === 0" :loading="uploading" @click="handleUpload">
            {{ uploading ? 'Uploading' : 'Start Upload' }}
        </a-button>
    </div>
</template>
  
<script>
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
    components: {
        UploadOutlined,
    },
    setup() {
        const fileList = ref([]);
        const uploading = ref(false);
        const handleRemove = file => {
            const index = fileList.value.indexOf(file);
            const newFileList = fileList.value.slice();
            newFileList.splice(index, 1);
            fileList.value = newFileList;
        };
        const beforeUpload = file => {
            fileList.value = [...fileList.value, file];
            return false;
        };
        const handleUpload = async () => {
            const formData = new FormData();
            const fieldName = 'geojsonfile';
            // formData.append(fieldName, file);
            fileList.value.forEach(file => {
                formData.append(fieldName, file);
            });
            uploading.value = true;
            // AJAX 
            try {
                await axios.post(`http://127.0.0.1:3000/upload/${fieldName}`, formData);
                fileList.value = [];
                uploading.value = false;
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