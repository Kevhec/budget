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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { WEEKDAYS } from '@/lib/constants';
import ConcurrenceDialog from '../ConcurrenceDialog';

type Props = {
  onSubmit: (value: z.infer<typeof budgetSchema>) => void
  formId: string
  className?: string
};

export default function BudgetForm({ onSubmit, formId, className }: Props) {
  const [concurrenceModalOpen, setConcurrenceModalOpen] = useState(false);
  const [isConcurrenceSelectOpen, setConcurrenceSelectOpen] = useState(false);
  const [isConcurrenceOptionHovered, setIsConcurrenceOptionHovered] = useState(false);
  const defaultStartDate = new Date();
  const defaultEndDate = new Date(defaultStartDate);

  defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      totalAmount: 0,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      concurrenceDefault: 'none',
      concurrenceTime: new Date(),
      concurrenceSteps: 1,
      concurrenceType: 'daily',
      concurrenceWeekDay: format(new Date(), 'dddd', 'en').toLowerCase() as typeof WEEKDAYS[number],
      concurrenceMonthSelect: 'exact',
    },
  });

  const containerClasses = cn('flex relative flex-col gap-2', className);

  const handleConcurrenceSelectOpen = (open: boolean) => {
    if (!isConcurrenceOptionHovered) {
      setConcurrenceSelectOpen(open);
    }
  };

  const handleConcurrenceMouseOver = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    if (evt.relatedTarget && !evt.currentTarget.contains(evt.relatedTarget as Node)) {
      if (evt.type === 'mouseenter') {
        setIsConcurrenceOptionHovered(true);
      } else {
        setIsConcurrenceOptionHovered(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form className={containerClasses} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Sueldo" {...field} />
              </FormControl>
              <FormDescription>
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
              <FormDescription>
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
                        'w-full pl-3 text-left font-normal',
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
              <FormDescription>
                ¿Cuándo iniciamos tu presupuesto?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="concurrenceDefault"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Se repite
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                open={isConcurrenceSelectOpen}
                onOpenChange={handleConcurrenceSelectOpen}
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
                    {format(new Date(), 'dddd')}
                  </SelectItem>
                  <SelectItem value="monthly">
                    Todos los meses, el
                    {' '}
                    {nthDay(new Date())}
                  </SelectItem>
                  <SelectItem value="yearly" className="peer">
                    Anualmente, el
                    {' '}
                    {new Date().getDate()}
                    {' de '}
                    {format(new Date(), 'MMMM')}
                  </SelectItem>
                  <ConcurrenceDialog
                    open={concurrenceModalOpen}
                    onOpenChange={setConcurrenceModalOpen}
                    form={form}
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
              <FormDescription>
                ¿Es recurrente tu presupuesto?
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha límite</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
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
              <FormDescription>
                ¿Cuándo lo terminamos?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
