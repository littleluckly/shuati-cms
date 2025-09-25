import { Routes, Route, Navigate } from "react-router-dom";
import SiderMenu from "./components/SiderMenu";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import QuestionList from "./pages/questions/QuestionList";
import QuestionForm from "./pages/questions/QuestionForm";
import SubjectList from "./pages/subjects/SubjectList";
import SubjectForm from "./pages/subjects/SubjectForm";
import NotFound from "./pages/NotFound";
import { QuestionProvider } from "./contexts/QuestionContext";
import { SubjectProvider } from "./contexts/SubjectContext";
import { Layout, ConfigProvider } from 'antd';
import { theme } from 'antd';

const { Content } = Layout;

function App() {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

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
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/questions">
                <Route 
                  index 
                  element={
                    <QuestionProvider>
                      <QuestionList />
                    </QuestionProvider>
                  }
                />
                <Route 
                  path="new" 
                  element={
                    <QuestionProvider>
                      <QuestionForm />
                    </QuestionProvider>
                  }
                />
                <Route 
                  path="edit/:id" 
                  element={
                    <QuestionProvider>
                      <QuestionForm />
                    </QuestionProvider>
                  }
                />
              </Route>
              <Route path="/subjects">
                <Route 
                  index 
                  element={
                    <SubjectProvider>
                      <SubjectList />
                    </SubjectProvider>
                  }
                />
                <Route 
                  path="create" 
                  element={
                    <SubjectProvider>
                      <SubjectForm />
                    </SubjectProvider>
                  }
                />
                <Route 
                  path="edit/:id" 
                  element={
                    <SubjectProvider>
                      <SubjectForm />
                    </SubjectProvider>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
