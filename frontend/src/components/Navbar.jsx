import { Menu, Layout, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { message } from 'antd';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return null; // ❗未登录不显示Navbar
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    message.success('Logged out successfully.');
    navigate('/login');
  };

  const employeeMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="/profile">Personal Information</Menu.Item>
      <Menu.Item key="/visa-status">Visa Status Management</Menu.Item>
    </Menu>
  );

  const hrMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="/hr/dashboard">Home</Menu.Item>
      <Menu.Item key="/hr/employee-profiles">Employee Profiles</Menu.Item>
      <Menu.Item key="/hr/visa-review">Visa Status Management</Menu.Item>
      <Menu.Item key="/hr/application-review">Hiring Management</Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
      <Dropdown overlay={user?.role === 'hr' ? hrMenu : employeeMenu}>
        <Button type="link">
          Menu <DownOutlined />
        </Button>
      </Dropdown>

      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default Navbar;
