import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useTableForm, MAX_TABLE_SIZE } from '@/hooks/useTableForm';

export const TableForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    increment,
    decrement,
    partySize,
    partySizeField,
    partySizeError,
  } = useTableForm();

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
              justifyContent="center"
            >
              <IconButton
                onClick={decrement}
                disabled={partySize <= 1}
                aria-label="Decrease"
              >
                <Remove />
              </IconButton>

              <TextField
                type="number"
                {...partySizeField}
                error={!!partySizeError}
                helperText={partySizeError?.message}
                sx={{ width: 80 }}
              />

              <IconButton
                onClick={increment}
                disabled={partySize >= MAX_TABLE_SIZE}
                aria-label="Increase"
              >
                <Add />
              </IconButton>
            </Stack>
          </Box>

          {/* Render image per customer, lets change the icon based on seats */}
          {/* TODO: REPLACE */}
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            {Array.from({ length: partySize }, (_, i) => (
              <img
                key={i}
                src="/wine.svg"
                alt={`Icon ${i + 1}`}
                width={32}
                height={32}
              />
            ))}
          </Box>

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TableForm;
