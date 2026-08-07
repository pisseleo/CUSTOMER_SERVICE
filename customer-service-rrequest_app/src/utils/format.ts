import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy \u00b7 HH:mm');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}
