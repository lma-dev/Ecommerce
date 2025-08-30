import LoginForm from "@/auth/_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-24 p-6 border rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Login to Your Account</h1>
      <LoginForm />
    </div>
  );
}
