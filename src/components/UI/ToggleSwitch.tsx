import React from "react";
import { Switch } from "@headlessui/react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  enableText?: string;
  disableText?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, enableText, disableText }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`relative inline-flex w-18 h-8 items-center rounded-full transition ${
        checked ? "bg-green-600" : "bg-red-500"
      }`}
    >
      {/* Text Labels Inside Switch */}
      <span
        className={`absolute left-2 text-base font-medium transition text-white ${
          checked ? "opacity-100" : "opacity-100 invisible"
        }`}
      >
        {enableText}
      </span>
      <span
        className={`absolute right-2 text-base font-medium transition text-white opacity-100${
          checked ? "opacity-100 invisible" : "opacity-100"
        }`}
      >
        {disableText}
      </span>

      {/* Moving Switch Ball */}
      <span
        className={`absolute left-1 inline-block size-6 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-10" : "translate-x-0"
        }`}
      />
    </Switch>
  );
};

export default ToggleSwitch;