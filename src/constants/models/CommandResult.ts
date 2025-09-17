export interface CommandResult {
  isSucceed: boolean;
  message: string;
}

export interface CommandResultWithData<T = any> extends CommandResult {
  data?: T;
}