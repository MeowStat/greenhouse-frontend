import { useState } from "react";
import { Combobox, ComboboxOption, ComboboxOptions, ComboboxButton, ComboboxInput } from "@headlessui/react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

interface ComboBoxProps {
  options: string[];
  selected: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  onCreateNew?: (value: string) => void; // Callback for creating a new feed
}

export function ComboBox({
  options,
  selected,
  onChange,
  placeholder = "Search or select...",
  onCreateNew,
}: ComboBoxProps) {
  const [query, setQuery] = useState("");

  // Filter options based on input
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative w-full">
        {/* Input Field */}
        <ComboboxInput
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          value={query === "" ? selected || "" : query} // Show selected value when query is empty
        />

        {/* Dropdown Button */}
        <ComboboxButton className="absolute inset-y-0 right-2 flex items-center">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </ComboboxButton>

        {/* Options List */}
        {filteredOptions.length > 0 && (
          <ComboboxOptions className="absolute mt-1 w-full rounded-lg border bg-white shadow-md z-10">
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option}
                value={option}
                className={({ active }) =>
                  cn(
                    "cursor-pointer px-3 py-2 text-sm",
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  )
                }
              >
                {({ selected }) => (
                  <div className="flex items-center">
                    {selected && (
                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                    )}
                    {option}
                  </div>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}

        {/* Create New Feed Option */}
        {filteredOptions.length === 0 && query.trim() !== "" && (
          <div
            className="absolute mt-1 w-full rounded-lg border bg-white shadow-md px-3 py-2 text-sm text-blue-600 cursor-pointer hover:bg-blue-50 flex items-center gap-2"
            onClick={() => {
              if (onCreateNew) {
                onCreateNew(query.trim()); // Call the onCreateNew callback
              }
              onChange(query.trim()); // Set the selected value to the new feed name
            }}
          >
            <Plus className="h-4 w-4" />
            Create new feed "{query.trim()}"
          </div>
        )}
      </div>
    </Combobox>
  );
}