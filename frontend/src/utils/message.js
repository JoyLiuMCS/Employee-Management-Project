import { message } from 'antd';

let loadingMessage = null;

export const showLoading = (content = 'Loading...') => {
  if (!loadingMessage) {
    loadingMessage = message.loading(content, 0);
  }
};

export const hideLoading = () => {
  if (loadingMessage) {
    loadingMessage();
    loadingMessage = null;
  }
};

export const showSuccess = (content) => {
  message.success(content);
};

export const showError = (content) => {
  message.error(content);
};
