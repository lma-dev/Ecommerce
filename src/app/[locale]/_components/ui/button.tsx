import { Button } from "@/components/ui/button";
import React from "react";

export const AnimationButton = ({ text }: { text: string }) => {
  return (
    <div>
      <Button
        className="block w-full rounded text-white bg-gray-900 p-2 text-sm font-medium transition hover:scale-105"
        aria-label="AnimationButton"
      >
        {text}
      </Button>
    </div>
  );
};

export const NormalButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <div>
      <button
        className="block w-full rounded-lg p-3 text-sm text-white bg-gray-900 font-medium transition hover:scale-105 border"
        onClick={onClick}
        type="submit"
        aria-label="NormalButton"
      >
        {text}
      </button>
    </div>
  );
};

export const FormSubmitButton = ({ text }: { text: string }) => {
  console.log("FormSubmitButton rendered with text:", text);
  return (
    <div>
      <Button variant="ghost" size="lg" type="submit" aria-label="Submit">
        {text}
      </Button>
    </div>
  );
};
