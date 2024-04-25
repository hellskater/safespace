"use client";

import {
  useGetUserKeyDetails,
  useSignupMutation,
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "@/lib/hooks/api/useProfileQueries";
import { generateSymmetricKey } from "@/utils/encryption";
import { Button } from "@ui/components/ui/button";

const App = () => {
  const { data: userProfile } = useUserProfileQuery();
  const { data: keyd } = useGetUserKeyDetails();

  const { mutate: signup } = useSignupMutation();
  const { mutate: updateProfile } = useUpdateUserProfileMutation();

  return (
    <div className="min-h-screen safe-paddings p-5">
      <main className="mt-20">
        <Button
          onClick={() => {
            const key = generateSymmetricKey();
            signup({ encryptionKey: key });
          }}
        >
          Sign up
        </Button>
        <Button
          onClick={() => {
            updateProfile({ firstName: "srini" });
          }}
        >
          Update profile
        </Button>
      </main>
    </div>
  );
};

export default App;
