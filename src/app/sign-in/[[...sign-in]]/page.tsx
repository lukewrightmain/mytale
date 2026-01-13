"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/Hero3.png"
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Image
            src="/images/assets/MyTaleText.png"
            alt="Mytale"
            width={200}
            height={50}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-foreground-muted mt-2">
            Sign in to continue your adventure
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface border border-border shadow-xl",
              headerTitle: "text-foreground",
              headerSubtitle: "text-foreground-muted",
              socialButtonsBlockButton: "bg-stone-800 border-border hover:bg-stone-700",
              socialButtonsBlockButtonText: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-foreground-muted",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-stone-800 border-border text-foreground",
              formButtonPrimary: "bg-primary-500 hover:bg-primary-600",
              footerActionLink: "text-primary-400 hover:text-primary-300",
              identityPreviewEditButton: "text-primary-400",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
}

