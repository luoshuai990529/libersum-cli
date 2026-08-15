export interface SuccessResponse<T> {
  readonly schemaVersion: 1;
  readonly ok: true;
  readonly action: string;
  readonly data: T;
}

export interface ErrorResponse {
  readonly schemaVersion: 1;
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export function okResponse<T>(action: string, data: T): SuccessResponse<T> {
  return { schemaVersion: 1, ok: true, action, data };
}

export function errorResponse(code: string, message: string): ErrorResponse {
  return { schemaVersion: 1, ok: false, error: { code, message } };
}
