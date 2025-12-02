import Layout from "./component/layout/Layout";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
