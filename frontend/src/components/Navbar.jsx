import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

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
        {/* 如果是 HR */}
        {user?.role === 'hr' && (
          <>
            <Menu.Item key="/hr/dashboard">Home</Menu.Item>
            <Menu.Item key="/hr/employee-profiles">Employee Profiles</Menu.Item>
            <Menu.Item key="/hr/visa-review">Visa Status Management</Menu.Item>
            <Menu.Item key="/hr/application-review">Hiring Management</Menu.Item>
          </>
        )}

        {/* 如果是普通 Employee */}
        {user?.role === 'employee' && (
          <>
            <Menu.Item key="/onboarding">Onboarding</Menu.Item>
            <Menu.Item key="/profile">Profile</Menu.Item>
            <Menu.Item key="/visa-status">Visa Status</Menu.Item>
          </>
        )}

        {/* Logout 按钮（只要登录就显示） */}
        {token && <Menu.Item key="logout" danger>Logout</Menu.Item>}
      </Menu>
    </Header>
  );
};

export default Navbar;
