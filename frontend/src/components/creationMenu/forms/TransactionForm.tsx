import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  CalendarIcon, Check, ChevronsUpDown, Circle,
} from 'lucide-react';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { transactionSchema } from '@/schemas/creation';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import useCategories from '@/hooks/useCategories';
import {
  Popover, PopoverContent, PopoverContentNoPortal, PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn, nthDay } from '@/lib/utils';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import useBudgets from '@/hooks/useBudgets';
import { format } from '@formkit/tempo';
import { Calendar } from '@/components/ui/calendar';
import ConcurrenceEndDate from '@/components/ConcurrenceEndDate';
import { WEEKDAYS } from '@/lib/constants';
import ConcurrenceDialog from '../ConcurrenceDialog';

type Props = {
  onSubmit: (value: z.infer<typeof transactionSchema>) => void
  formId: string
  className?: string
  dirtyChecker?: React.Dispatch<React.SetStateAction<boolean>>
};

export default function TransactionForm({
  onSubmit, formId, className, dirtyChecker,
}: Props) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [budgetsOpen, setBudgetsOpen] = useState(false);
  const [isConcurrenceSelectOpen, setConcurrenceSelectOpen] = useState(false);
  const [isConcurrenceOptionHovered, setIsConcurrenceOptionHovered] = useState(false);
  const { state: { categories } } = useCategories();
  const { state: { budgets } } = useBudgets();
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      type: 'expense',
      amount: 0,
      categoryId: categories.find((category) => category.name === 'General')?.id,
      budgetId: undefined,
      startDate: new Date(),
      concurrenceDefault: 'none',
      concurrenceTime: new Date(),
      concurrenceSteps: 1,
      concurrenceWithEndDate: 'true',
      concurrenceType: 'daily',
      concurrenceWeekDay: format(new Date(), 'dddd', 'en').toLowerCase() as typeof WEEKDAYS[number],
      concurrenceMonthSelect: 'exact',
      concurrenceEndDate: undefined,
    },
  });

  const [currentDefaultConcurrence, currentStartDate] = useWatch({
    control: form.control,
    name: ['concurrenceDefault', 'startDate'],
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (dirtyChecker) {
      dirtyChecker(isDirty);
    }
  }, [isDirty, dirtyChecker]);

  const containerClasses = cn('flex flex-col gap-2 md:gap-4', className);

  const comboboxCategories = categories.map((category) => ({
    value: category.id,
    label: category.name,
    color: category.color,
  }));

  const comboboxBudgets = budgets.map((budget) => ({
    value: budget.id,
    label: budget.name,
  }));

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

  return (
    <Form {...form}>
      <form className={containerClasses} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Tipo de transacción
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Entretenimiento" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Describe tu transacción
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$200.000" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                ¿Cuánto dinero?
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
              <FormLabel>Fecha</FormLabel>
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
                Selecciona la fecha de tu transacción
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              const currentValue = field.value;
              const currentCategory = comboboxCategories.find(
                (category) => category.value === currentValue,
              );

              return (
                <FormItem className="flex flex-col md:block">
                  <FormLabel>Categoría</FormLabel>
                  <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !currentValue && 'text-muted-foreground',
                          )}
                        >
                          <div className="flex gap-2 items-center">
                            <Circle fill={currentCategory?.color || '#000000'} stroke="none" className="w-3" />
                            {currentValue
                              ? currentCategory?.label
                              : 'General'}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContentNoPortal align="end" className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Busca una categoría..." />
                        <ScrollArea className="h-64">
                          <CommandList className="max-h-none overflow-visible">
                            <CommandEmpty>No se encontró ninguna categoría</CommandEmpty>
                            <CommandGroup>
                              {comboboxCategories.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue('categoryId', category.value);
                                    setCategoriesOpen(false);
                                  }}
                                  className="flex justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <Circle fill={category.color || '#000000'} stroke="none" className="w-3" />
                                    {category.label}
                                  </div>
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      category.value === currentValue
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </ScrollArea>
                      </Command>
                    </PopoverContentNoPortal>
                  </Popover>
                  <FormDescription className="text-xs">
                    Selecciona una categoría
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="flex flex-col md:block">
                <FormLabel>Presupuesto</FormLabel>
                <Popover open={budgetsOpen} onOpenChange={setBudgetsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <div className="flex gap-2 items-center">
                          {field.value
                            ? comboboxBudgets.find(
                              (budget) => budget.value === field.value,
                            )?.label
                            : 'Selecciona un presupuesto'}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContentNoPortal align="end" className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Busca un presupuesto..." />
                      <ScrollArea className="max-h-64">
                        <CommandList className="max-h-none overflow-visible">
                          <CommandEmpty>No se encontró ninguna categoría</CommandEmpty>
                          <CommandGroup>
                            {comboboxBudgets?.map((budget) => (
                              <CommandItem
                                value={budget.label}
                                key={budget.value}
                                onSelect={() => {
                                  form.setValue('budgetId', budget.value);
                                  setBudgetsOpen(false);
                                }}
                                className="flex gap-2"
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    budget.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  {budget.label}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </ScrollArea>
                    </Command>
                  </PopoverContentNoPortal>
                </Popover>
                <FormDescription className="text-xs">
                  ¿Tu transacción hace parte de un presupuesto?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          !['none', 'custom'].includes(currentDefaultConcurrence) && (
            <ConcurrenceEndDate
              form={form}
            />
          )
        }
      </form>
    </Form>
  );
}
