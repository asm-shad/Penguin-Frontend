"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import InputFieldError from "../shared/InputFieldError";
import { Button } from "../ui/button";
import { registerUser } from "@/services/auth/registerUser";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success(state.message || "Registration successful!");
    }
  }, [state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create FormData from the form
    const formData = new FormData(event.currentTarget);

    // Make sure the file is included
    if (fileInputRef.current?.files?.[0]) {
      formData.set("file", fileInputRef.current.files[0]); // Use set() to replace if exists
    }

    // Call the server action with the FormData
    formAction(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Image Upload */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="file">Profile Picture (Optional)</FieldLabel>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="cursor-pointer"
            />
            <FieldDescription>
              Upload a profile picture (optional)
            </FieldDescription>
          </Field>

          {/* Rest of your form fields - KEEP THEM EXACTLY AS THEY ARE */}
          {/* Name */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="name">Full Name *</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              // required
            />
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Email */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              // required
            />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Phone */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
            <InputFieldError field="phone" state={state} />
          </Field>

          {/* Gender */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <InputFieldError field="gender" state={state} />
          </Field>

          {/* Address Section */}
          <div className="md:col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">
              Address Information *
            </h3>

            {/* Address Name */}
            <Field className="mb-4">
              <FieldLabel htmlFor="addressName">Address Name *</FieldLabel>
              <Input
                id="addressName"
                name="addressName"
                type="text"
                placeholder="Home, Office, etc."
                // required
              />
              <InputFieldError field="addressName" state={state} />
            </Field>

            {/* Address Line */}
            <Field className="mb-4">
              <FieldLabel htmlFor="addressLine">Street Address *</FieldLabel>
              <Input
                id="addressLine"
                name="addressLine"
                type="text"
                placeholder="123 Main Street"
                // required
              />
              <InputFieldError field="addressLine" state={state} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <Field>
                <FieldLabel htmlFor="city">City *</FieldLabel>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  // required
                />
                <InputFieldError field="city" state={state} />
              </Field>

              {/* State */}
              <Field>
                <FieldLabel htmlFor="state">State *</FieldLabel>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="NY"
                  // required
                />
                <InputFieldError field="state" state={state} />
              </Field>

              {/* Zip Code */}
              <Field>
                <FieldLabel htmlFor="zipCode">Zip Code *</FieldLabel>
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="10001"
                  // required
                />
                <InputFieldError field="zipCode" state={state} />
              </Field>
            </div>

            {/* Country */}
            <Field className="mt-4">
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="US"
                defaultValue="US"
              />
              <InputFieldError field="country" state={state} />
            </Field>

            {/* Is Default Address */}
            <Field className="mt-4 flex items-center gap-2">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                defaultChecked
                value="on"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <FieldLabel htmlFor="isDefault" className="mb-0!">
                Set as default address
              </FieldLabel>
            </Field>
          </div>

          {/* Password Section */}
          <div className="md:col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Security *</h3>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password *</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                // required
              />
              <InputFieldError field="password" state={state} />
            </Field>

            {/* Confirm Password */}
            <Field className="mt-4">
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password *
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                // required
              />
              <InputFieldError field="confirmPassword" state={state} />
            </Field>
          </div>
        </div>

        <FieldGroup className="mt-6">
          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className="text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
