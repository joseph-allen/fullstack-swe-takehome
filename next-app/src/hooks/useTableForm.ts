import { useForm, useController, useWatch } from 'react-hook-form';

export const MAX_TABLE_SIZE = 8;

export type TableFormValues = {
  name: string;
  partySize: number;
};

// default partySize is 1, assumed most common table size but could be inferred from previous bookings
export function useTableForm() {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TableFormValues>({
    defaultValues: {
      name: '',
      partySize: 1,
    },
  });

  // useController hook to manage partySize, I don't need to rewrite validation rules in TableForm
  // connect a specific form field to React hook forms internal form state and validation
  const {
    field: partySizeField,
    fieldState: { error: partySizeError },
  } = useController({
    name: 'partySize',
    control,
    rules: {
      required: 'Party size is required',
      min: { value: 1, message: 'Minimum is 1' },
      max: { value: MAX_TABLE_SIZE, message: `Max is ${MAX_TABLE_SIZE}` },
    },
  });

  // subscribe to changes on field, tests found that multiple rapid increments didn't re-render
  const partySize = useWatch({ control, name: 'partySize' });

  // increment never above the largest table the resturant offers.
  const increment = () => {
    setValue('partySize', Math.min(MAX_TABLE_SIZE, partySize + 1));
  };

  const decrement = () => {
    setValue('partySize', Math.max(1, partySize - 1));
  };

  const onSubmit = (data: TableFormValues) => {
    console.log('Form submitted:', data);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    increment,
    decrement,
    partySize,
    partySizeField,
    partySizeError,
  };
}
