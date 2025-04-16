import React from 'react';
import { Field, Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  enableText?: string;
  disableText?: string;
  disabled?: boolean;
  width?: number;      // in px
  height?: number;     // in px
  ballSize?: number;   // in px
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  enableText = '',
  disableText = '',
  disabled = false,
  width = 72,          // default 72px (like Tailwind w-18)
  height = 30,         // default 24px (like Tailwind h-6)
  ballSize = 22        // default 16px
}) => {
  const padding = 4; // internal spacing for ball from edges
  const translateX = width - ballSize - padding * 2;

  return (
    <Field disabled={disabled}>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 ${
          checked ? 'bg-green-600' : 'bg-red-500'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          padding: `${padding}px`,
        }}
      >
        {/* Text Labels */}
        <span
          className={`absolute left-2 text-sm font-medium text-white transition-all duration-200 ${
            checked ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {enableText}
        </span>
        <span
          className={`absolute right-2 text-sm font-medium text-white transition-all duration-200 ${
            checked ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {disableText}
        </span>

        {/* Switch Ball */}
        <span
          className="absolute bg-white rounded-full shadow transition-transform duration-300"
          style={{
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            transform: `translateX(${checked ? translateX : 0}px)`,
          }}
        />
      </Switch>
    </Field>
  );
};

export default ToggleSwitch;
