"use client";

import NovelEditor from "@/components/editor";
import {
  useGetUserKeyDetails,
  useSignupMutation,
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "@/lib/hooks/api/useProfileQueries";
import { generateSymmetricKey } from "@/utils/encryption";
import { Button } from "@ui/components/ui/button";

const App = () => {
  // const { data: userProfile } = useUserProfileQuery();
  // const { data: keyd } = useGetUserKeyDetails();

  // const { mutate: signup } = useSignupMutation();
  // const { mutate: updateProfile } = useUpdateUserProfileMutation();

  return (
    <div className="min-h-screen safe-paddings p-5">
      <main className="mt-20">
        <NovelEditor />
      </main>
    </div>
  );
};

export default App;
