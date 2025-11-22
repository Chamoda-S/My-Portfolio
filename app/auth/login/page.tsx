import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - Portfolio Admin",
  description: "Login to manage your portfolio",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Welcome Back</h1>
          <p className="text-muted-foreground text-pretty">Sign in to manage your cosmic portfolio</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
