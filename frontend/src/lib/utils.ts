/* eslint-disable import/prefer-default-export */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DAY_NAMES_SPANISH } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function getMonthFromDate(date: Date) {
  return date.toLocaleString('default', { month: 'long' });
}

export function getDayOrdinalNumber(dayNumber: number) {
  return Math.ceil(dayNumber / 7);
}

export function nthDay(date: Date = new Date(), withMonth?: boolean) {
  const nth = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];

  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const dayNumber = date.getDate();

  return `${nth[Math.ceil(dayNumber / 7) - 1]} ${
    DAY_NAMES_SPANISH[date.getDay()]} ${withMonth ? `de ${monthNames[date.getMonth()]}` : ''}`.trim();
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
