
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const SignUpConfirmation = () => {
  return (
    <div className="max-w-md mx-auto my-12">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-dictionary-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a confirmation email. Please click the link in the email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Once verified, you'll be able to sign in and start using your account.</p>
          <p className="mt-4">Didn't receive an email? Check your spam folder.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/signin">
            <Button variant="outline">Return to Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpConfirmation;
