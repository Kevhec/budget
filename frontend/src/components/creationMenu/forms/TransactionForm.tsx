import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronsUpDown, Circle } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';

type Props = {
  onSubmit: (value: z.infer<typeof transactionSchema>) => void
  formId: string
  className?: string
};

export default function TransactionForm({ onSubmit, formId, className }: Props) {
  const { state: { categories } } = useCategories();
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      type: 'expense',
      amount: 0,
      categoryId: categories.find((category) => category.name === 'General')?.id,
    },
  });

  const containerClasses = cn('flex flex-col gap-2', className);

  const comboboxCategories = categories.map((category) => ({
    value: category.id,
    label: category.name,
    color: category.color,
  }));

  return (
    <Form {...form}>
      <form className={containerClasses} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 md:grid grid-cols-2">
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
                <FormDescription>
                  Tipo de transacción
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Popover>
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
                    <PopoverContent align="end" className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Busca una categoría..." />
                        <CommandList>
                          <CommandEmpty>No se encontró ninguna categoría</CommandEmpty>
                          <CommandGroup>
                            {comboboxCategories.map((category) => (
                              <CommandItem
                                value={category.label}
                                key={category.value}
                                onSelect={() => {
                                  form.setValue('categoryId', category.value);
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
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Selecciona la categoría de tu transacción
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Entretenimiento" {...field} />
              </FormControl>
              <FormDescription>
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
              <FormDescription>
                ¿Cuánto dinero?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}
