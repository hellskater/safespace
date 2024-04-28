"use client";

import {
  useGetUserKeyDetails,
  useRotateKeyMutation,
} from "@/lib/hooks/api/useProfileQueries";
import { Key, LockKeyhole, RotateCw } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@ui/components/ui/button";
import { useGetAllNotesOfUserQuery } from "@/lib/hooks/api/useNotesQuery";
import { useState } from "react";
import { CustomAlert } from "@ui/components/custom/custom-alert";
import {
  decryptJson,
  decryptString,
  encryptJson,
  encryptString,
  generateSymmetricKey,
} from "@/utils/encryption";
import { cn } from "@ui/lib/utils";
dayjs.extend(relativeTime);

const KeyForm = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { data: keyDetails } = useGetUserKeyDetails();

  const { mutateAsync: rotateKey, isPending: isRotating } =
    useRotateKeyMutation();

  const { data: allNotes } = useGetAllNotesOfUserQuery();

  const hiddenKey = () => {
    // only show the first 4 characters of the key, rest x
    const key = keyDetails?.value;
    if (!key)
      return "6075xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    return `${key.slice(0, 4)}${"x".repeat(key.length - 4)}`;
  };

  const handleRotateKey = async () => {
    if (!keyDetails) return;

    if (allNotes?.length === 0) {
      const newKey = generateSymmetricKey();
      setIsAlertOpen(false);
      await rotateKey({ newKey, oldKeyId: keyDetails?.id });
      return;
    }

    const formattedNotes = allNotes?.map((note) => {
      const decryptedNote = {
        id: note.id,
        title: decryptString(note.title, keyDetails?.value ?? ""),
        content: decryptJson(note.content, keyDetails?.value ?? "{}"),
      };
      return decryptedNote;
    });

    const newKey = generateSymmetricKey();

    const encryptedNotes = formattedNotes?.map((note) => {
      const encryptedNote = {
        id: note.id,
        title: encryptString(note.title, newKey),
        content: encryptJson(note.content, newKey),
      };
      return encryptedNote;
    });

    setIsAlertOpen(false);
    await rotateKey({
      newKey,
      notesData: encryptedNotes,
      oldKeyId: keyDetails?.id,
    });
  };

  return (
    <div>
      <div className="flex items-center font-semibold gap-3 text-stone-500 text-2xl">
        <Key className="w-10 h-10 text-yellow-300" />
        <h3>Your encryption key details</h3>
      </div>
      <h2 className="flex items-center gap-2 mt-14">
        <LockKeyhole className="w-6 h-6 text-blue-500" />
        <p className="text-lg font-semibold text-blue-500">
          AES 256-bit Encryption key
        </p>
      </h2>
      <div className="mt-5 border-2 border-red-300 bg-red-100/50 w-fit px-6 py-3 text-stone-500 tracking-widest">
        <p>{hiddenKey()}</p>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <p className="text-stone-600 tracking-wide">Version: </p>
        <p className="text-blue-500 font-semibold">{`${keyDetails?.currentVersion ?? 0}.0`}</p>
      </div>
      {keyDetails?.lastRotatedAt && (
        <div className="mt-5 flex items-center gap-2">
          <p className="text-stone-600 tracking-wide">Last rotated: </p>
          <p className="text-blue-500 font-semibold">
            {dayjs(keyDetails.lastRotatedAt).fromNow()}
          </p>
        </div>
      )}
      <div className="mt-10">
        <Button
          className="font-semibold flex items-center gap-2 text-base"
          variant="destructive"
          disabled={isRotating || !keyDetails}
          onClick={() => setIsAlertOpen(true)}
        >
          <RotateCw
            className={cn("w-5 h-5 text-white", isRotating && "animate-spin")}
          />
          <p>Rotate key</p>
        </Button>
      </div>
      {isAlertOpen && (
        <CustomAlert
          open={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          title="Are you sure you want to rotate your encryption key?"
          description="We will be regenerating your encryption key, this will affect all your notes. This action cannot be undone."
          handleSubmit={handleRotateKey}
          isSubmitting={isRotating}
        />
      )}
    </div>
  );
};

export default KeyForm;
