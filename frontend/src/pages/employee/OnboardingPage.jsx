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
      const res = await api.post('/onboarding/submit', formData);
  
      showSuccess('Submitted successfully!');
      console.log('✅ Server Response:', res.data);
  
      // 提交成功后（可选跳转 Profile，已经在之前讲过了）
      navigate('/profile');
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
        email: auth.user?.email || '',  // (可选) 默认值，后面可以从 Redux user里取
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