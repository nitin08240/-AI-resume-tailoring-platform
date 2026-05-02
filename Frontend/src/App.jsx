import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ToastProvider } from "./features/toast/toast.context.jsx"
import { ThemeProvider } from "./features/theme/theme.context.jsx"
import ToastContainer from "./features/toast/ToastContainer.jsx"
import ThemeToggle from "./features/theme/ThemeToggle.jsx"
import UserDropdown from "./features/auth/components/UserDropdown.jsx"

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <InterviewProvider>

            {/* Global Controls — fixed top-right */}
            <div style={{
              position: 'fixed',
              top: '1rem',
              right: '1.25rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <ThemeToggle />
              <UserDropdown />
            </div>

            <RouterProvider router={router} />

            {/* Toast portal — rendered once at root */}
            <ToastContainer />

          </InterviewProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App