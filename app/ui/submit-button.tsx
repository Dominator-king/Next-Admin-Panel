'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './button';
import { Spinner } from './spinner';

export function SubmitButton({ type }: { type: 'Edit' | 'Create' }) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button aria-disabled={pending} type="submit">
        {` ${type} Invoice`}
      </Button>
      {pending && <Spinner />}
    </>
  );
}
