import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SiderMenu from "./components/SiderMenu";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import QuestionList from "./pages/questions/QuestionList";
import QuestionForm from "./pages/questions/QuestionForm";
import SubjectList from "./pages/subjects/SubjectList";
import SubjectForm from "./pages/subjects/SubjectForm";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { QuestionProvider } from "./contexts/QuestionContext";
import { SubjectProvider } from "./contexts/SubjectContext";
import { Layout, ConfigProvider, Spin } from "antd";
import { theme } from "antd";
import { useAuth } from "./hooks/useAuth";

const { Content } = Layout;

// 受保护的路由组件
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // 只有在加载完成后，才根据认证状态决定是否跳转
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { loading } = useAuth();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: colorBgContainer,
        }}
      >
        <Spin size="large" />
        <div style={{ marginLeft: 16 }}>加载中...</div>
      </div>
    );
  }
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Layout>
              <SiderMenu />
              <Layout>
                <Header />
                <Content
                  style={{
                    margin: "16px",
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <QuestionProvider>
                    <SubjectProvider>
                      <Routes>
                        {/* 受保护的路由 */}
                        <Route element={<ProtectedRoute />}>
                          <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                          />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/questions">
                            <Route index element={<QuestionList />} />
                            <Route path="new" element={<QuestionForm />} />
                            <Route path="edit/:id" element={<QuestionForm />} />
                          </Route>
                          <Route path="/subjects">
                            <Route index element={<SubjectList />} />
                            <Route path="create" element={<SubjectForm />} />
                            <Route path="edit/:id" element={<SubjectForm />} />
                          </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </SubjectProvider>
                  </QuestionProvider>
                </Content>
              </Layout>
            </Layout>
          }
        />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
