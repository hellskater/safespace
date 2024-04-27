"use client";

/* eslint-disable @next/next/no-img-element */
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "@/lib/hooks/api/useProfileQueries";
import { Label } from "@ui/components/ui/label";
import { Input } from "@ui/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@ui/components/ui/button";

const SettingsForm = () => {
  const { data: userProfile } = useUserProfileQuery();

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
  }>(() => {
    const firstName = userProfile?.firstName ?? "";
    const lastName = userProfile?.lastName ?? "";

    return {
      firstName,
      lastName,
    };
  });

  const setToInitialState = () => {
    setFormData({
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
    });
  };

  const isDirty = (() => {
    const initialData = {
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
    };

    return JSON.stringify(initialData) !== JSON.stringify(formData);
  })();

  useEffect(() => {
    if (!userProfile) return;
    setToInitialState();
  }, [userProfile]);

  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateUserProfileMutation();

  const shouldDisableSubmit = !isDirty || isUpdating;

  const handleSave = async () => {
    if (shouldDisableSubmit) return;

    await updateProfile(formData);
  };

  return (
    <div className="space-y-5 max-w-lg">
      <div className="border-2 border-yellow-300 w-fit rounded-full p-2 overflow-hidden">
        <img
          src={userProfile?.imageUrl ?? "/images/robot.png"}
          alt="user profile"
          onError={(e) => {
            e.currentTarget.src = "/images/robot.png";
          }}
          className="h-20 w-20 rounded-full object-cover"
        />
      </div>
      <div>
        <Label className="font-semibold text-lg" htmlFor="firstName">
          First Name
        </Label>
        <Input
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          id="firstName"
          placeholder="John"
          type="text"
          className="mt-2"
        />
      </div>
      <div>
        <Label className="font-semibold text-lg" htmlFor="lastName">
          Last Name
        </Label>
        <Input
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          id="lastName"
          placeholder="Doe"
          type="text"
          className="mt-2"
        />
      </div>
      <Button
        onClick={handleSave}
        disabled={shouldDisableSubmit}
        className="mt-10"
      >
        {isUpdating ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default SettingsForm;
