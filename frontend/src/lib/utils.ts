/* eslint-disable import/prefer-default-export */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CreationParamsUnion, SimplifiedConcurrence } from '@/types';
import { concurrenceInit, DAY_NAMES_SPANISH, SPANISH_MONTHS } from './constants';

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

  const dayNumber = date.getDate();

  return `${nth[Math.ceil(dayNumber / 7) - 1]} ${
    DAY_NAMES_SPANISH[date.getDay()]} ${withMonth ? `de ${SPANISH_MONTHS[date.getMonth()]}` : ''}`.trim();
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getFirstDate(dates: Date[]) {
  let firstDate: Date = dates[0] || new Date();

  dates.forEach((date) => {
    if (date <= firstDate || !firstDate) {
      firstDate = date;
    }
  });

  return firstDate;
}

export function hasOneYearPassed(fromDate: Date) {
  const now = new Date();
  const nextYear = new Date(fromDate);
  nextYear.setFullYear(fromDate.getFullYear() + 1);

  return now >= nextYear;
}

export function extractConcurrenceData(data: CreationParamsUnion) {
  if (data.concurrenceDefaults === 'none') return undefined;

  const concurrenceOnlyEntries = Object.entries(data).filter(([key]) => key.startsWith('concurrence'));

  const simplifiedEntries = concurrenceOnlyEntries.map(([key, value]) => {
    const replacedKey = key.replace('concurrence', '');
    const firstLowerCaseKey = replacedKey[0].toLowerCase() + replacedKey.substring(1);

    return [firstLowerCaseKey, value];
  });

  return Object.fromEntries(
    simplifiedEntries,
  ) as unknown as SimplifiedConcurrence;
}

// FIXME: This function is broken due to the structure of concurrenceInit
export function resetConcurrence(formSetter: (name: string, value: unknown) => void) {
  const entries = Object.entries(concurrenceInit);

  entries.forEach(([name, value]) => {
    formSetter(name, value);
  });
}

export function generateYearsList(from: number, to?: number) {
  const endYear = to || new Date().getFullYear();
  const yearsList = [];
  let currentYear = from;

  while (currentYear <= endYear) {
    yearsList.push(currentYear);
    currentYear += 1;
  }

  return yearsList;
}

export function getModeValue(editMode: boolean | undefined) {
  return function selectValue <T>(editValue: T, defaultValue: T) {
    if (editValue instanceof Date && Number.isNaN(editValue.getTime())) {
      return defaultValue;
    }

    return editMode && editValue ? editValue : defaultValue;
  };
}

export function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

export function updateArrayItem<T extends { id: string }>(arr: T[], id: string, item: T) {
  let found = false;

  if (!arr || !id || !item) {
    throw new Error('All params must be provided');
  }

  const updatedArr = arr.map((currentItem) => {
    if (currentItem.id === id) {
      found = true;
      return item;
    }

    return currentItem;
  });

  return found ? updatedArr : arr;
}

export function removeFromArrayById<T extends { id: string }>(arr: T[], id: string) {
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }

  if (!id) {
    throw new Error('Item id must be provided');
  }

  const itemIndex = arr.findIndex((item) => item.id === id);

  if (itemIndex < 0) {
    return arr;
  }

  const updatedArray = arr.toSpliced(itemIndex, 1);

  return updatedArray;
}
