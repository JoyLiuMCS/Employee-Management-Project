import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';  // ⭐️ 加了 useNavigate
import { useSelector } from 'react-redux'; 
import { useEffect, useState } from 'react';
import PersonalInfoForm from './onboarding/PersonalInfoForm';
import AddressForm from './onboarding/AddressForm';
import ContactInfoForm from './onboarding/ContactInfoForm';
import VisaInfoForm from './onboarding/VisaInfoForm';
import EmergencyContactForm from './onboarding/EmergencyContactForm';
import UploadDocumentsForm from './onboarding/UploadDocumentsForm';
import api from '../../utils/api';
import { showLoading, showSuccess, showError, hideLoading } from '../../utils/message';




const OnboardingPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ⭐️ 初始化 navigate
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.token) {
      setTimeout(() => {
        navigate('/login?redirect=onboarding');
      }, 100); 
    }
  }, [auth.token, navigate]);
  

  const onFinish = async (values) => {
    try {
      setLoading(true);  // ⭐️ 开启 loading
      showLoading('Submitting your onboarding form...');
  
      const formData = new FormData();
  
      for (const key in values) {
        if (
          key !== 'profilePicture' &&
          key !== 'driversLicense' &&
          key !== 'workAuthorization' &&
          key !== 'emergencyContacts'
        ) {
          formData.append(key, values[key]);
        }
      }
  
      if (values.profilePicture?.originFileObj) {
        formData.append('profilePicture', values.profilePicture.originFileObj);
      }
      if (values.driversLicense?.originFileObj) {
        formData.append('driversLicense', values.driversLicense.originFileObj);
      }
      if (values.workAuthorization?.originFileObj) {
        formData.append('workAuthorization', values.workAuthorization.originFileObj);
      }
  
      if (values.emergencyContacts) {
        formData.append('emergencyContacts', JSON.stringify(values.emergencyContacts));
      }
  
      // 发 POST 请求
      const res = await api.post('/api/onboarding/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      showSuccess('Submitted successfully!');
      console.log('✅ Server Response:', res.data);
  
      // 提交成功后（可选跳转 Profile，已经在之前讲过了）
      // navigate('/profile');
    } catch (err) {
      console.error('❌ Error submitting onboarding form:', err);
      showError('Submission failed, please try again.');
    } finally {
      setLoading(false);  // ⭐️ 关闭 loading
      hideLoading();  // ⭐️ 关闭全局 loading
    }
  };
  

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        email: '', // (可选) 默认值，后面可以从 Redux user里取
      }}
      style={{ maxWidth: 500, margin: '0 auto' }}
    >
      <PersonalInfoForm />
      <AddressForm />
      <ContactInfoForm />
      <VisaInfoForm />
      <EmergencyContactForm />
      <UploadDocumentsForm />

      <Form.Item style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Onboarding Application
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OnboardingPage;
// 这个页面是员工入职的主页面，包含了所有的表单部分
// 通过 Form.Item 组合成一个完整的表单
// 通过 onFinish 方法提交表单数据
// 通过 useNavigate 方法实现页面跳转
// 通过 message 提示用户操作结果
// 通过 FormData 处理文件上传
// 通过 api.post 方法发送 POST 请求
// 通过 useForm 方法创建表单实例
// 通过 layout 属性设置表单布局
// 通过 initialValues 属性设置表单默认值
// 通过 style 属性设置表单样式
// 通过 form 属性绑定表单实例
// 通过 onFinish 属性绑定提交事件
// 通过 onFinishFailed 属性绑定提交失败事件
// 通过 form.validateFields 方法验证表单
// 通过 form.resetFields 方法重置表单
// 通过 form.setFieldsValue 方法设置表单值
// 通过 form.getFieldValue 方法获取表单值 