import LoginPage from "../Login";

interface LoginProps {
  onSwitchToSignup?: () => void;
}

export default function Login(_props: LoginProps) {
  return <LoginPage />;
}
