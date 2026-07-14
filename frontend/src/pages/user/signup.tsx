import Register from "../Register";

interface SignupProps {
  onSwitchToLogin?: () => void;
}

export default function Signup(_props: SignupProps) {
  return <Register />;
}
