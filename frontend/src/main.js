import MainLayout from "./layout/mainLayout.js";
import { Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Welcome from "./pages/Welcome.js"
import Dashboard from "./pages/dashboard.js";
import DeviceList from "./pages/device/DeviceList"
import DeviceForm from "./pages/device/DeviceForm"
import Users from "./pages/user/Users.js";
import UserAdd from "./pages/user/user-add";
import UserEdit from "./pages/user/user-edit";
import AuditList from "./pages/audittrail/AuditList";
import AuditForm from "./pages/audittrail/AuditForm";
import Department from "./pages/department/deparetment";
import AccessLog from "./pages/accesslog/accesslog"

function Main() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="welcome" element={<Welcome />} />
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to={"/dashboard"} replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="device" element={<DeviceList />} />
            <Route path="device/:id" element={<DeviceForm />} />
            <Route path="deparement" element={<Department />} />
            <Route path="users" element={<Users />} />
            <Route path="useradd" element={<UserAdd />} />
            <Route path="useredit/:id" element={<UserEdit />} />
            <Route path="audit" element={<AuditList />} />
            <Route path="audit/:id" element={<AuditForm  />} />
            <Route path="access" element={<AccessLog />} />
          </Route>
        </Routes>
      </Provider>
    </>
  );
}

export default Main;
