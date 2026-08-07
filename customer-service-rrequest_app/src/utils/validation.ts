// import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateServiceRequest } from '../types';

export type FormErrors = Partial<Record<keyof CreateServiceRequest, string>>;

const ValidateRequestSchema = z.object({
  title: z.string().min(3, 'title must be at least 3 characters long'),
  description: z.string().min(10, 'description must be at least 10 characters long'),
  category: z.string().min(2, 'category must be at least 2 characters long'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  requesterName: z.string().min(2, 'requester name must be at least 2 characters long'),
  requesterEmail: z.string().email('Please enter a valid email address'),
});

export const validateCreateRequest = (input: CreateServiceRequest): FormErrors => {
  const result = ValidateRequestSchema.safeParse(input);
  if (result.success) return {};
  const errors: FormErrors = {};
  for (const issue of result.error.issues) {
    if (issue.path.length > 0) {
      const field = issue.path[0] as keyof CreateServiceRequest;
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}