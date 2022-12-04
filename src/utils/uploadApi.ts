import axios from 'axios';
import {NODE_ENV} from './NODE_ENV';

const request = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: NODE_ENV === 'development' ? 'http://localhost:4444' : '',
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 60 * 1000,
});


class UploadApi {
  async post(file: any, onProgress: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress(progressEvent) {
        // eslint-disable-next-line no-bitwise,no-mixed-operators
        onProgress(progressEvent.loaded / progressEvent.total * 100 | 0);
      }
    });
  }
}

export default new UploadApi();
