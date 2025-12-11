/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/auth/auth.service";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const ChangePasswordPage = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(changePassword, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    } else if (state?.success) {
      toast.success(state.message || "Password changed successfully!");
    }
  }, [state]);

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="text-gray-600 mt-2">
          Update your account password for enhanced security
        </p>
      </div>

      <form action={formAction}>
        {redirect && <Input type="hidden" name="redirect" value={redirect} />}
        
        <FieldGroup className="space-y-4">
          {/* Current Password */}
          <Field>
            <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
            <InputFieldError field="oldPassword" state={state as any} />
          </Field>

          {/* New Password */}
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <InputFieldError field="newPassword" state={state as any} />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              required
            />
            <InputFieldError field="confirmPassword" state={state as any} />
          </Field>

          {/* Submit Button */}
          <Field className="mt-6">
            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full"
            >
              {isPending ? "Updating..." : "Change Password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="text-center mt-6">
        <a href="/my-profile" className="text-blue-600 hover:underline">
          Back to Profile
        </a>
      </FieldDescription>
    </div>
  );
};

export default ChangePasswordPage;