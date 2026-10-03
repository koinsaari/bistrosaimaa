'use client';

import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type WeekOption = { isoYear: number; isoWeek: number; label: string };

export default function WeekSelector({ options, current }: { options: WeekOption[]; current: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="week-select">Viikko</Label>
      <Select
        value={current}
        onValueChange={(value) => {
          const [year, week] = value.split('-');
          router.push(`/admin/lunch?year=${year}&week=${week}`);
        }}
      >
        <SelectTrigger id="week-select" className="w-full data-[size=default]:h-11 sm:w-64" data-testid="week-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={`${option.isoYear}-${option.isoWeek}`} value={`${option.isoYear}-${option.isoWeek}`}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
