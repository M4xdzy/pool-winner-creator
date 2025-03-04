
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto mb-8 flex flex-col items-center">
        <img src="/images/logo.svg" alt="Logo" className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-center">Hockey Pool Pro</h1>
        <p className="text-muted-foreground text-center mt-2">
          La meilleure plateforme pour gérer vos ligues de hockey
        </p>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default Login;
