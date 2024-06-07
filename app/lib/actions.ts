'use server';
import bcrypt from 'bcrypt';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { z } from 'zod';
import { randomUUID } from 'crypto';
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter a number greater than zero' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
export type State = {
  id?: string;
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
const createInvoice = FormSchema.omit({ id: true, date: true });
const updateInvoice = FormSchema.omit({ id: true, date: true });

export async function CreateInvoice(prevState: State, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = createInvoice.safeParse({ ...rawData });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create invoice',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`INSERT INTO invoices (customer_id,amount,status,date)
    VALUES(${customerId},${amountInCents},${status},${date})`;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function UpdateInvoice(prevState: State, formData: FormData) {
  const id = prevState.id;
  const rawData = Object.fromEntries(formData.entries());
  // const { customerId, amount, status } = updateInvoice.parse({ ...rawData });
  const validatedData = updateInvoice.safeParse({ ...rawData });
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update invoice',
    };
  }
  const { amount, customerId, status } = validatedData.data;
  const amountInCents = amount * 100;

  try {
    await sql`UPDATE invoices 
   SET customer_id=${customerId},amount=${amountInCents},status=${status}
   WHERE id=${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string, formData: FormData) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to delete Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
export async function RegisterUser(
  prevState: string | undefined,
  formData: FormData,
) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = z
    .object({
      name: z.string().max(20),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse({ ...rawData });

  if (validatedFields.success) {
    const { name, email, password } = validatedFields.data;
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await sql`INSERT INTO users (id, name, email, password)
        VALUES (${id}, ${name}, ${email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (error) {
      return 'Database Error: Failed to register user.';
    }
    redirect('/login');
  }
  return 'Invalid Fields. Failed to register user.';
}
