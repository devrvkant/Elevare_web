import { Outlet } from "react-router";
import ToastContainer from "@/components/ui/Toast";

const App = () => {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
};

export default App;
