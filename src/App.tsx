import { Layout, theme } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import SiderMenu from './components/SiderMenu';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import QuestionList from './pages/QuestionList';
import QuestionForm from './pages/QuestionForm';
import NotFound from './pages/NotFound';

const { Content } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <SiderMenu />
      <Layout>
        <Header />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route path="/questions/new" element={<QuestionForm />} />
            <Route path="/questions/edit/:id" element={<QuestionForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
