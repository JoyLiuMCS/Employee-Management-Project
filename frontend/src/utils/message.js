// src/utils/message.js
import { message } from 'antd';

// 设置 message 全局默认配置
message.config({
  duration: 2,    // 每条信息默认显示 2 秒
  maxCount: 3,    // 同时最多 3 条信息
});

// 显示 loading（需要手动关闭）
const showLoading = (content = 'Loading...') => {
  message.loading({ content, key: 'global', duration: 0 });
};

// 显示成功信息
const showSuccess = (content = 'Success!') => {
  message.success({ content, key: 'global', duration: 2 });
};

// 显示错误信息
const showError = (content = 'Something went wrong!') => {
  message.error({ content, key: 'global', duration: 2 });
};

// 关闭 loading
const hideLoading = () => {
  message.destroy('global');
};

export { showLoading, showSuccess, showError, hideLoading };
