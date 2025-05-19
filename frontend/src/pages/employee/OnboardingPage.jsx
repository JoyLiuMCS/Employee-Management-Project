import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState(null);


  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.token) {
        setTimeout(() => navigate('/login?redirect=onboarding'), 100);
        return;
      }
  
      try {
        const res = await api.get('/onboarding/status');
        setApplication(res.data);
        setStatus(res.data.status);
  
        if (res.data.status === 'pending') {
          navigate('/profile');
        } else if (res.data.status === 'approved') {
          navigate('/home');
        }
        // ✅ rejected 状态保留在当前页面
      } catch (err) {
        console.error('❌ Failed to fetch onboarding status:', err);
      }
    };
  
    checkAccess();
  }, [auth.token, navigate]);
  

  const onFinish = async (values) => {
    try {
      setLoading(true);
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

      await api.post('/onboarding/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.patch(`/users/${auth.user.id}`, {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        preferredName: values.preferredName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        ssn: values.ssn,
        phoneNumber: values.phoneNumber,
        workPhone: values.workPhone,
        address: values.address,
        citizenshipStatus: values.citizenshipStatus,
        visaTitle: values.visaTitle,
        visaStartDate: values.workAuthorizationStart,
        visaEndDate: values.workAuthorizationEnd,
        otherVisaTitle: values.otherVisaTitle,
        emergencyContacts: values.emergencyContacts,
      });

      showSuccess('Submitted successfully!');
      console.log('✅ Server Response: Onboarding and Profile updated.');
      navigate('/profile');
    } catch (err) {
      console.error('❌ Error submitting onboarding form:', err);
      showError('Submission failed, please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        email: auth.user?.email || '',
      }}
      style={{ maxWidth: 500, margin: '0 auto' }}
    >
      {status === 'rejected' && application?.rejectionReason && (
      <div style={{ marginBottom: '1rem', color: 'red', border: '1px solid red', padding: '0.5rem' }}>
        <strong>Your application was rejected:</strong> {application.rejectionReason}
      </div>
    )}
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
