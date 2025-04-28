import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      navigate(e.key);
    }
  };

  return (
    <Header style={{ background: '#fff', padding: 0 }}>
      <Menu
        theme="light"
        mode="horizontal"
        onClick={handleMenuClick}
        selectedKeys={[]}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Menu.Item key="/onboarding">Onboarding</Menu.Item>
        <Menu.Item key="/profile">Profile</Menu.Item>
        <Menu.Item key="/visa-status">Visa Status</Menu.Item>
        {auth.token && <Menu.Item key="logout" danger>Logout</Menu.Item>}
      </Menu>
    </Header>
  );
};

export default Navbar;
