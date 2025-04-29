import { Card, Typography } from 'antd';
import Navbar from '../../components/Navbar';
const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <>
    <Navbar />
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Card>
        <Title>Welcome to Employee Portal!</Title>
        <Paragraph>🎉 Your onboarding has been approved. You can now access your dashboard and company resources.</Paragraph>
      </Card>
    </div>
    </>
  );
};

export default HomePage;
