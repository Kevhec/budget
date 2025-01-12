import { cn } from '@/lib/utils';
import { Format, format } from '@formkit/tempo';
import { CalendarIcon } from 'lucide-react';
import {
  ControllerRenderProps,
  FieldValues, Path, UseFormReturn, useWatch,
} from 'react-hook-form';
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import Typography from './Typography';

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
}

export default function ConcurrenceEndDate<T extends FieldValues>(
  {
    form,
  }: Props<T>,
) {
  const [withEndDate, concurrenceDefaults, startDate] = useWatch({
    control: form.control,
    name: ['concurrenceWithEndDate', 'concurrenceDefaults', 'startDate'] as Path<T>[],
  });

  const getFormattedDate = (field: ControllerRenderProps<T, Path<T>>, formatType: Format) => {
    if (Number.isNaN(field.value.getTime())) {
      return withEndDate === 'true' ? format(new Date(), formatType) : '';
    }
    return format(field.value, formatType);
  };

  return (
    <div className="flex gap-4 relative">
      <FormField
        control={form.control}
        name={'concurrenceWithEndDate' as Path<T>}
        render={({ field }) => (
          <FormItem className="grid grid-rows-[min-content,1fr] gap-2">
            <FormLabel>
              Parar
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      value="false"
                      disabled={
                      concurrenceDefaults === 'none'
                    }
                    />
                  </FormControl>
                  <FormLabel
                    className={cn({
                      'text-slate-500': concurrenceDefaults === 'none',
                    })}
                  >
                    Nunca
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel>
                    El
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'concurrenceEndDate' as Path<T>}
        render={({ field }) => (
          <FormItem className="flex-1 grid grid-rows-2">
            <FormLabel className="sr-only">Fecha límite</FormLabel>
            <Popover>
              <PopoverTrigger asChild disabled={withEndDate === 'false'}>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal row-start-2',
                      !field.value && 'text-muted-foreground',
                    )}
                    disabled={withEndDate === 'false'}
                  >
                    {field.value ? (
                      <>
                        <Typography variant="span" className="md:hidden">
                          {
                            getFormattedDate(field, 'medium')
                          }
                        </Typography>
                        <Typography variant="span" className="hidden md:inline">
                          {
                            getFormattedDate(field, 'long')
                          }
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="span">Selecciona una fecha</Typography>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={{ before: startDate as Date || null }}
                />
              </PopoverContent>
            </Popover>
            <FormDescription className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-full text-center text-xs">
              ¿Cuándo deseas terminar esta suscripción?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
