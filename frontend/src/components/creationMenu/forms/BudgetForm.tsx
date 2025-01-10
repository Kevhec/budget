import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl, FormDescription, FormField, FormItem, FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn, nthDay } from '@/lib/utils';
import { budgetSchema } from '@/schemas/creation';
import { format } from '@formkit/tempo';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { WEEKDAYS } from '@/lib/constants';
import ConcurrenceEndDate from '@/components/ConcurrenceEndDate';
import Typography from '@/components/Typography';
import { type Budget } from '@/types';
import ConcurrenceDialog from '../ConcurrenceDialog';

export type BudgetFormProps = {
  onSubmit: (value: z.infer<typeof budgetSchema>) => void
  formId: string
  className?: string
  dirtyChecker?: React.Dispatch<React.SetStateAction<boolean>>
  editMode?: boolean
  item?: Budget
};

const defaultStartDate = new Date();
const defaultEndDate = new Date(defaultStartDate);

defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

export default function BudgetForm({
  onSubmit, formId, className, dirtyChecker, item,
}: BudgetFormProps) {
  const [isConcurrenceSelectOpen, setConcurrenceSelectOpen] = useState(false);
  const [isConcurrenceOptionHovered, setIsConcurrenceOptionHovered] = useState(false);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      totalAmount: 0,
      startDate: undefined,
      endDate: undefined,
      concurrenceDefaults: 'none',
      concurrenceTime: new Date(),
      concurrenceSteps: 1,
      concurrenceWithEndDate: 'true',
      concurrenceType: 'daily',
      concurrenceWeekDay: format(new Date(), 'dddd', 'en').toLowerCase() as typeof WEEKDAYS[number],
      concurrenceMonthSelect: 'exact',
      concurrenceEndDate: undefined,
    },
  });

  const { formState: { isDirty } } = form;

  const [currentDefaultConcurrence, currentStartDate] = useWatch({
    control: form.control,
    name: ['concurrenceDefaults', 'startDate'],
  });

  const handleConcurrenceSelectOpen = useCallback((open: boolean) => {
    if (!isConcurrenceOptionHovered) {
      setConcurrenceSelectOpen(open);
    }
  }, [isConcurrenceOptionHovered]);

  const handleConcurrenceMouseOver = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    if (evt.relatedTarget && !evt.currentTarget.contains(evt.relatedTarget as Node)) {
      const didMouseEnter = evt.type === 'mouseenter';
      setIsConcurrenceOptionHovered(didMouseEnter);
    }
  };

  useEffect(() => {
    if (dirtyChecker) {
      dirtyChecker(isDirty);
    }
  }, [isDirty, dirtyChecker]);

  useEffect(() => {
    console.log(item);
  }, [item]);

  useEffect(() => {
    if (currentStartDate) {
      const newEndDate = new Date(currentStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);

      form.setValue('endDate', newEndDate);
      form.setValue('concurrenceEndDate', newEndDate);
    } else {
      form.setValue('concurrenceDefaults', 'none');
    }
  }, [currentStartDate, form]);

  const containerClasses = cn('flex relative flex-col gap-6', className);

  return (
    <Form {...form}>
      <form className={containerClasses} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Sueldo" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Describe tu presupuesto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad destinada</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$200.000" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                ¿Cuánto tienes presupuestado?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal row-start-2',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'long')
                      ) : (
                        <span>Selecciona una fecha</span>
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
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-xs">
                ¿Cuándo inicia?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="concurrenceDefaults"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Se repite
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                open={isConcurrenceSelectOpen}
                onOpenChange={handleConcurrenceSelectOpen}
                disabled={currentStartDate === undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Evento único" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none" defaultChecked>
                    Evento único
                  </SelectItem>
                  <SelectItem value="daily">
                    Todos los días
                  </SelectItem>
                  <SelectItem value="weekly">
                    Cada semana, el
                    {' '}
                    {format((currentStartDate || new Date()), 'dddd')}
                  </SelectItem>
                  <SelectItem value="monthly">
                    Todos los meses, el
                    {' '}
                    {nthDay(currentStartDate)}
                  </SelectItem>
                  <SelectItem value="yearly" className="peer">
                    Anualmente, el
                    {' '}
                    {(currentStartDate || new Date()).getDate()}
                    {' de '}
                    {format((currentStartDate || new Date()), 'MMMM')}
                  </SelectItem>
                  <ConcurrenceDialog
                    form={form}
                    containerToggler={setConcurrenceSelectOpen}
                    trigger={(
                      <SelectItem
                        onMouseEnter={handleConcurrenceMouseOver}
                        onMouseOut={handleConcurrenceMouseOver}
                        value="custom"
                      >
                        Personalizado...
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                {/* TODO: Pensar otro mensaje */}
                ¿Es recurrente?
              </FormDescription>
            </FormItem>
          )}
        />
        {
          currentDefaultConcurrence !== 'custom' && (
            currentDefaultConcurrence !== 'none' ? (
              <ConcurrenceEndDate
                form={form}
              />
            ) : (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fecha límite</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal row-start-2',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              <Typography variant="span">
                                {format((field.value || new Date()), 'long')}
                              </Typography>
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
                          disabled={{ before: currentStartDate || null }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      ¿Cuándo termina?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )
        }
      </form>
    </Form>
  );
}
