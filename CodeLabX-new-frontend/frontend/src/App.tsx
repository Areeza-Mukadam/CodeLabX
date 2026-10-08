import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AuthGuard, RolePage } from "./components/RouteGuards";
import { PracticalFormPage } from "./pages/PracticalFormPage";
import { PracticalLabPage } from "./pages/PracticalLabPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { SemesterSelectionPage } from "./pages/SemesterSelectionPage";
import {
  SubmissionListPage,
  SubmissionReviewPage,
} from "./pages/SubmissionReviewPage";
import { TeacherDashboardPage } from "./pages/TeacherDashboardPage";
import { useAuth } from "./state/authStore";

function Home() {
  const user = useAuth((state) => state.user);
  if (user?.role === "ADMIN") return <AdminDashboardPage />;
  return user?.role === "TEACHER" ? (
    <TeacherDashboardPage />
  ) : (
    <StudentDashboardPage />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route
              path="/semester-selection"
              element={
                <RolePage role="STUDENT">
                  <SemesterSelectionPage />
                </RolePage>
              }
            />
            <Route
              path="/admin"
              element={
                <RolePage role="ADMIN">
                  <AdminDashboardPage />
                </RolePage>
              }
            />
            <Route
              path="/practicals/:id/*"
              element={
                <RolePage role="STUDENT">
                  <PracticalLabPage />
                </RolePage>
              }
            />
            <Route
              path="/teacher"
              element={
                <RolePage role="TEACHER">
                  <TeacherDashboardPage />
                </RolePage>
              }
            />
            <Route
              path="/teacher/practicals/new"
              element={
                <RolePage role="TEACHER">
                  <PracticalFormPage />
                </RolePage>
              }
            />
            <Route
              path="/teacher/practicals/:id/edit"
              element={
                <RolePage role="TEACHER">
                  <PracticalFormPage />
                </RolePage>
              }
            />
            <Route
              path="/teacher/submissions"
              element={
                <RolePage role="TEACHER">
                  <SubmissionListPage />
                </RolePage>
              }
            />
            <Route
              path="/teacher/submissions/:id"
              element={
                <RolePage role="TEACHER">
                  <SubmissionReviewPage />
                </RolePage>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
