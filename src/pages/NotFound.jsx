import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，您访问的页面不存在。"
    extra={
      <Button type="primary" as={Link} to="/">
        返回首页
      </Button>
    }
  />
);

export default NotFound;
