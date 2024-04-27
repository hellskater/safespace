"use client";

import { useGetUserKeyDetails } from "@/lib/hooks/api/useProfileQueries";
import { Key, LockKeyhole, RotateCw } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@ui/components/ui/button";
dayjs.extend(relativeTime);

const KeyForm = () => {
  const { data: keyDetails } = useGetUserKeyDetails();

  const hiddenKey = () => {
    // only show the first 4 characters of the key, rest x
    const key = keyDetails?.value;
    if (!key)
      return "6075xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    return `${key.slice(0, 4)}${"x".repeat(key.length - 4)}`;
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
        >
          <RotateCw className="w-5 h-5 text-white" />
          <p>Rotate key</p>
        </Button>
      </div>
    </div>
  );
};

export default KeyForm;
