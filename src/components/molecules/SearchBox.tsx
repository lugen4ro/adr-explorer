import { ActionIcon, Group } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { TextInput } from "../atoms";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search...",
}: SearchBoxProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs">
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1 }}
          rightSection={
            value.trim() && (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <IconX size={16} />
              </ActionIcon>
            )
          }
        />
      </Group>
    </form>
  );
}
