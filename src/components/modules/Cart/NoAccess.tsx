"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/shared/Logo";
import { useRouter } from "next/navigation";

interface NoAccessProps {
  details?: string;
  redirectTo?: string;
}

const NoAccess = ({ 
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
  redirectTo = "/cart"
}: NoAccessProps) => {
  const router = useRouter();
  
  const handleSignIn = () => {
    router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const handleSignUp = () => {
    router.push(`/register?redirect=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex items-center flex-col">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-medium text-darkColor/80">{details}</p>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSignIn}
          >
            Sign in
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&rsquo;t have an account?
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={handleSignUp}
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;