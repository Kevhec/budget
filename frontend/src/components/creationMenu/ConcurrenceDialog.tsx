import React, { useRef, useState } from 'react';
import {
  FieldValues, Path, UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { cn, nthDay } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Period } from '../timePicker/time-picker-utils';
import { TimePickerInput } from '../timePicker/time-picker-input';
import { TimePeriodSelect } from '../timePicker/period-select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import ConcurrenceEndDate from '../ConcurrenceEndDate';

const concurrenceTypes = [
  {
    id: 'daily',
    value: {
      sing: 'día',
      plur: 'días',
    },
  },
  {
    id: 'weekly',
    value: {
      sing: 'semana',
      plur: 'semanas',
    },
  },
  {
    id: 'monthly',
    value: {
      sing: 'mes',
      plur: 'meses',
    },
  },
  {
    id: 'semestrial',
    value: {
      sing: 'semestre',
      plur: 'semestres',
    },
  },
  {
    id: 'yearly',
    value: {
      sing: 'año',
      plur: 'años',
    },
  },
];

const weekdaysOptions = [
  {
    value: 'monday',
    label: {
      sr: 'Lunes',
      visual: 'L',
    },
  },
  {
    value: 'tuesday',
    label: {
      sr: 'Martes',
      visual: 'M',
    },
  },
  {
    value: 'wednesday',
    label: {
      sr: 'Miércoles',
      visual: 'X',
    },
  },
  {
    value: 'thursday',
    label: {
      sr: 'Jueves',
      visual: 'J',
    },
  },
  {
    value: 'friday',
    label: {
      sr: 'Viernes',
      visual: 'V',
    },
  },
  {
    value: 'saturday',
    label: {
      sr: 'Sábado',
      visual: 'S',
    },
  },
  {
    value: 'sunday',
    label: {
      sr: 'Domingo',
      visual: 'D',
    },
  },
];

interface Props<T extends FieldValues = FieldValues> {
  trigger: React.ReactNode
  form: UseFormReturn<T>
  containerToggler?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConcurrenceDialog<T extends FieldValues>({
  trigger,
  form,
  containerToggler,
}: Props<T>) {
  const [period, setPeriod] = useState<Period>('PM');
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentSteps, currentType] = useWatch({
    control: form.control,
    name: ['concurrenceSteps', 'concurrenceType'] as Path<T>[],
  });

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  const handleSave = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const isFormOk = await form.trigger(
      ['concurrenceTime', 'concurrenceType', 'concurrenceTime', 'concurrenceWeekDay', 'concurrenceMonthSelect'] as Path<T>[],
    );

    if (isFormOk) {
      setDialogOpen(false);
    }

    if (containerToggler) {
      containerToggler(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (containerToggler && !open) {
      containerToggler(false);
    }
    setDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger
        asChild
      >
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] rounded-sm">
        <DialogHeader>
          <DialogTitle>
            Concurrencia
          </DialogTitle>
          <DialogDescription className="sr-only">
            Define cómo se debe repetir la creación de tu presupuesto
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name={'concurrenceSteps' as Path<T>}
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <FormLabel className="whitespace-nowrap">Repetir cada</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} className="w-16 text-center" value={field.value} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'concurrenceType' as Path<T>}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel className="sr-only">
                  Tipo de concurrencia
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="!mt-0 capitalize">
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {concurrenceTypes.map((type) => (
                      <SelectItem
                        value={type.id}
                        className="capitalize"
                        key={`concurrence-type-${type.id}`}
                      >
                        {
                          currentSteps && currentSteps > 1
                            ? type.value.plur
                            : type.value.sing
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={'concurrenceTime' as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel htmlFor="hours">
                Tiempo
              </FormLabel>
              <FormControl className="!mt-0">
                <div className="flex gap-3">
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="hours">
                      Horas
                    </FormLabel>
                    <FormControl>
                      <TimePickerInput
                        picker="12hours"
                        period={period}
                        id="hours"
                        date={field.value}
                        setDate={field.onChange}
                        ref={hourRef}
                        onRightFocus={() => minuteRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="minutes">
                      Minutos
                    </FormLabel>
                    <FormControl>
                      <TimePickerInput
                        picker="minutes"
                        id="minutes"
                        date={field.value}
                        setDate={field.onChange}
                        ref={minuteRef}
                        onLeftFocus={() => hourRef.current?.focus()}
                        onRightFocus={() => periodRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel htmlFor="period">
                      Periodo
                    </FormLabel>
                    <FormControl>
                      <TimePeriodSelect
                        id="period"
                        period={period}
                        setPeriod={setPeriod}
                        date={field.value}
                        setDate={field.onChange}
                        ref={periodRef}
                        onLeftFocus={() => minuteRef.current?.focus()}
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          currentType === 'weekly' && (
            <FormField
              control={form.control}
              name={'concurrenceWeekDay' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Repetir el
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-evenly"
                    >
                      {
                        weekdaysOptions.map((weekday) => (
                          <FormItem
                            className="flex items-center space-y-0"
                            key={`concurrence-weekday-radio-${weekday.value}`}
                          >
                            <FormControl>
                              <RadioGroupItem value={weekday.value} className="!sr-only" />
                            </FormControl>
                            <FormLabel className={cn(
                              'p-1.5 aspect-square min-w-[auto] rounded-full bg-slate-100 w-8 grid place-items-center transition-colors',
                              {
                                'bg-slate-400': field.value === weekday.value,
                                'hover:bg-slate-300': field.value !== weekday.value,
                              },
                            )}
                            >
                              <span className="sr-only">{weekday.label.sr}</span>
                              <span aria-hidden>{weekday.label.visual}</span>
                            </FormLabel>
                          </FormItem>
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {
          currentType === 'monthly' && (
            <FormField
              control={form.control}
              name={'concurrenceMonthSelect' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">
                    Día del mes
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el día de concurrencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exact">
                        Todos los meses,
                        {' el día '}
                        {new Date().getDate()}
                      </SelectItem>
                      <SelectItem value="ordinal">
                        Todos los meses, el
                        {' '}
                        {nthDay(new Date())}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        <ConcurrenceEndDate
          form={form}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave} type="button">Guardar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
