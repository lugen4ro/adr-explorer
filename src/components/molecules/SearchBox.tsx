import { ActionIcon, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { TextInput } from "../atoms";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
}: SearchBoxProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
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
            <ActionIcon
              type="submit"
              variant="subtle"
              color="gray"
              onClick={onSubmit}
            >
              <IconSearch size={16} />
            </ActionIcon>
          }
        />
      </Group>
    </form>
  );
}
