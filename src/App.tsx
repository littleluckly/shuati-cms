import { Layout, theme, ConfigProvider } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import SiderMenu from "./components/SiderMenu";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import QuestionList from "./pages/questions/QuestionList";
import QuestionForm from "./pages/questions/QuestionForm";
import NotFound from "./pages/NotFound";
import { QuestionProvider } from "./contexts/QuestionContext";

const { Content } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#00b96b",
          borderRadius: 20,

          // 派生变量，影响范围小
          colorBgContainer: "#fff",
        },
      }}
    >
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
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/questions" element={<QuestionList />} />
                <Route path="/questions/new" element={<QuestionForm />} />
                <Route path="/questions/edit/:id" element={<QuestionForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QuestionProvider>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
