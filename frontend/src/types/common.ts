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

export interface LoadingAction<T> {
  type: T,
  payload: boolean
}

export type FormProps<T> = {
  onSubmit: (data: T) => void | Promise<void>;
  formId: string
};
