import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui';
import { ButtonGroup } from '@/components/ui';
import { Field, FieldGroup, FieldLabel } from '@/components/ui';
import { Input } from '@/components/ui';

interface SearchInputGroupProps {
  id: string;
  label?: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  submitLabel?: string;
  value: string;
}

export function SearchInputGroup({
  id,
  label = 'Search',
  onChange,
  onClear,
  onSubmit,
  placeholder,
  submitLabel = 'Search',
  value,
}: SearchInputGroupProps) {
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <ButtonGroup>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-11 rounded-2xl border-white/10 bg-[#2a2c31] pr-10 pl-10 text-white placeholder:text-muted-foreground sm:rounded-r-none"
              />
              {value ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-white"
                  onClick={onClear}
                >
                  <X className="size-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-11 sm:rounded-l-none"
              variant="outline"
            >
              {submitLabel}
            </Button>
          </ButtonGroup>
        </Field>
      </FieldGroup>
    </form>
  );
}
