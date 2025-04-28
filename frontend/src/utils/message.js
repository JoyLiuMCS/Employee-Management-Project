import { message } from 'antd';

// 统一设置 message 全局默认配置
message.config({
  duration: 2,  // 默认持续2秒
  maxCount: 3,  // 同时最多显示3个message
});

const showLoading = (content = 'Loading...') => {
  message.loading({ content, key: 'global', duration: 0 });
};

const showSuccess = (content = 'Success!') => {
  message.success({ content, key: 'global', duration: 2 });
};

const showError = (content = 'Something went wrong!') => {
  message.error({ content, key: 'global', duration: 2 });
};

const hideLoading = () => {
  message.destroy('global');  // 销毁全局loading
};

export { showLoading, showSuccess, showError, hideLoading };
