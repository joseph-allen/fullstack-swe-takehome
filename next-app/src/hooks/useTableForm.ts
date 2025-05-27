import { useForm, useController, useWatch } from 'react-hook-form';
import { TableFormValues } from '@/types/tableForm';
export const MAX_TABLE_SIZE = 8;

// default size is 1, assumed most common table size but could be inferred from previous bookings
export function useTableForm(customOnSubmit?: (data: TableFormValues) => void) {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TableFormValues>({
    defaultValues: {
      name: '',
      size: 1,
    },
  });

  // useController hook to manage size, I don't need to rewrite validation rules in TableForm
  // connect a specific form field to React hook forms internal form state and validation
  const {
    field: rawsizeField,
    fieldState: { error: sizeError },
  } = useController({
    name: 'size',
    control,
    rules: {
      required: 'Party size is required',
      min: { value: 1, message: 'Minimum is 1' },
      max: { value: MAX_TABLE_SIZE, message: `Max is ${MAX_TABLE_SIZE}` },
    },
  });

  // Number input allows text input - good, but can otherwise be changed far beyond 8
  const sizeField = {
    ...rawsizeField,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      const clamped = Math.max(1, Math.min(MAX_TABLE_SIZE, value));
      rawsizeField.onChange(clamped);
    },
  };

  // subscribe to changes on field, tests found that multiple rapid increments didn't re-render
  const size = useWatch({ control, name: 'size' });

  // increment never above the largest table the resturant offers.
  const increment = () => {
    setValue('size', Math.min(MAX_TABLE_SIZE, size + 1));
  };

  const decrement = () => {
    setValue('size', Math.max(1, size - 1));
  };

  // temporary support for a custom onSubmit
  const onSubmit = (data: TableFormValues) => {
    if (customOnSubmit) {
      customOnSubmit(data);
    } else {
      console.log('Form submitted:', data);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    increment,
    decrement,
    size,
    sizeField,
    sizeError,
  };
}
