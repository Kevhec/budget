export type Months =
'enero' |
'febrero' |
'marzo' |
'abril' |
'junio' |
'julio' |
'agosto' |
'septiembre' |
'octubre' |
'noviembre' |
'diciembre';

export enum WeekDays {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum Ordinals {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  FOURTH = 'fourth',
  FIFTH = 'fifth',
}

export interface LoadingAction<T> {
  type: T,
  payload: boolean
}

export type FormProps<T> = {
  onSubmit: (data: T) => void | Promise<void>;
  formId: string
};
