import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import Image from 'next/image';
import { Add, Remove } from '@mui/icons-material';
import { useTableForm, MAX_TABLE_SIZE } from '@/hooks/useTableForm';
import { TableFormValues } from '@/types/tableForm';

export const TableForm: React.FC<{
  onSubmit?: (data: TableFormValues) => void;
  isLoading?: boolean;
}> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    onSubmit: internalSubmit,
    errors,
    increment,
    decrement,
    size,
    sizeField,
    sizeError,
  } = useTableForm(onSubmit);

  return (
    <div style={{ width: 400, maxWidth: 400, padding: 3 }}>
      <form onSubmit={handleSubmit(internalSubmit)} noValidate>
        <Stack spacing={3}>
          <Typography variant="h5" textAlign="center">
            Join the queue
          </Typography>

          <TextField
            label="Name"
            fullWidth
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Typography variant="h5">Party size:</Typography>
              <IconButton
                onClick={decrement}
                disabled={size <= 1}
                aria-label="Decrease"
              >
                <Remove />
              </IconButton>

              <TextField
                id="party-input"
                data-testid="party-input"
                aria-label="party-input"
                type="number"
                {...sizeField}
                error={!!sizeError}
                helperText={sizeError?.message}
                sx={{ width: 80 }}
              />

              <IconButton
                onClick={increment}
                disabled={size >= MAX_TABLE_SIZE}
                aria-label="Increase"
              >
                <Add />
              </IconButton>
            </Stack>
          </Box>

          <Box minHeight="48px" textAlign="center">
            {size >= MAX_TABLE_SIZE && (
              <Alert severity="warning">
                <Typography variant="body2">
                  For parties larger than {MAX_TABLE_SIZE}, please speak to the
                  staff.
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Render image per customer */}
          <Box
            minHeight="128px"
            display="flex"
            flexWrap="wrap"
            gap={1}
            justifyContent="center"
          >
            {Array.from({ length: size }, (_, i) => (
              <Image
                key={i}
                src="/person.apng"
                alt={`Icon ${i + 1}`}
                width={64}
                height={64}
                style={{
                  transformOrigin: 'bottom center',
                  transform: 'scale(0)',
                  transition: 'transform 300ms ease',
                  animation: 'scaleUpTrigger 0s forwards',
                }}
                onLoad={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ))}
          </Box>

          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default TableForm;
