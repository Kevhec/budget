const dateStringRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const initialPaginatedState = {
  status: 200,
  data: [],
  meta: {
    currentPage: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
  links: {},
};

const defaultPaginatedOptions = {
  page: 1,
  limit: 30,
  date: new Date(),
};

const CONCURRENCE_TYPE = ['daily', 'weekly', 'monthly', 'semestrial', 'yearly'] as const;

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const DEFAULT_CONCURRENCES = ['none', 'custom', 'daily', 'weekly', 'monthly', 'yearly'] as const;

const DAY_NAMES_SPANISH = ['domingo', 'lunes', 'martes', 'miércoles',
  'jueves', 'viernes', 'sábado'] as const;

const ENGLISH_ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'] as const;

const SPANISH_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export {
  dateStringRegex,
  initialPaginatedState,
  defaultPaginatedOptions,
  CONCURRENCE_TYPE,
  DEFAULT_CONCURRENCES,
  WEEKDAYS,
  DAY_NAMES_SPANISH,
  ENGLISH_ORDINALS,
  SPANISH_MONTHS,
};
