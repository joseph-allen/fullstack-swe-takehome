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
    <Paper elevation={3} sx={{ width: 400, maxWidth: 400, mx: 'auto', p: 3 }}>
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
              justifyContent="space-evenly"
            >
              <Typography variant="h5">Party size:</Typography>
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

          {/* Render image per customer */}
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            {Array.from({ length: partySize }, (_, i) => (
              <img
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

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TableForm;
