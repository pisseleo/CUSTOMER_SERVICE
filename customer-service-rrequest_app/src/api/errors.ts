// import { string } from "zod/v4";

export type ApiErrorType = 'auth'| 'validation' | 'not_found' | 'conflict' | 'server' |'network'| 'unknown';

export interface InputError {
    field: string;
    message: string;
}

export class ApiError extends Error {
    kind: ApiErrorType;
    status?: number;
    fieldErrors?: InputError[];

    //initialize construtor with body params
    constructor(message:string, kind: ApiErrorType, status?: number, fieldErrors?:InputError[]){
        super(message)
        this.name = 'ApiError';
        this.kind = kind;
        this.status = status;
        this.fieldErrors = fieldErrors;
    }

     static fromStatus(status: number, body: unknown): ApiError {
    const message = extractMessage(body);
    const fieldErrors = extractFieldErrors(body);

    if (status === 401) return new ApiError(message ?? 'Your session has expired. Please sign in again.', 'auth', status);
    if (status === 403) return new ApiError(message ?? 'You do not have permission to perform this action.', 'auth', status);
    if (status === 404) return new ApiError(message ?? 'The requested resource could not be found.', 'not_found', status);
    if (status === 409) return new ApiError(message ?? 'This request was modified elsewhere. Reload and try again.', 'conflict', status, fieldErrors);
    if (status === 422 || status === 400) return new ApiError(message ?? 'The submitted data is invalid.', 'validation', status, fieldErrors);
    if (status >= 500) return new ApiError(message ?? 'The server encountered an error. Please try again shortly.', 'server', status);
    return new ApiError(message ?? 'Something went wrong.', 'unknown', status, fieldErrors);
  }

  static network(): ApiError {
    return new ApiError('Could not reach the server. Check your connection and try again.', 'network');
  }

  
}
//funcrions out of base class scope instanciated
function extractMessage(body: unknown): string | undefined {
    if(body && typeof body === 'object' && 'message' in body && typeof (body as {message: unknown}).message === 'string'){
        return (body as {message:string}).message;
    }

    return undefined;
  }

  function extractFieldErrors(body: unknown): InputError[] | undefined {
    if(body && typeof body === 'object' && 'errors' in body){
        const errors = (body as {errors: unknown}).errors
        if(Array.isArray(errors)){
            return errors.filter((e): e is {field: string; message:string} => typeof e === 'object' && e !== null && 'field' in e && 'message' in e)
            .map((e) => ({field: String(e.field), message: String(e.message)}));
        }
    }
    return undefined
  }