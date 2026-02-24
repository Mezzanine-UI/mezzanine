import { formPrefix } from './form';

export const formGroupPrefix = `${formPrefix}-group`;

export const formGroupClasses = {
  host: formGroupPrefix,
  title: `${formGroupPrefix}__title`,
  fieldsContainer: `${formGroupPrefix}__fields-container`,
} as const;
