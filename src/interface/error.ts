export type TErrorSources = {
  path: PropertyKey; // This changes string | number to string | number | symbol
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};


