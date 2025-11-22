import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata = {
  title: "Sign Up - Portfolio Admin",
  description: "Create your portfolio admin account",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Create Account</h1>
          <p className="text-muted-foreground text-pretty">Join the cosmic journey</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
