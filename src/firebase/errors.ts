
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;
  public readonly cause?: Error;

  constructor(
    context: SecurityRuleContext,
    options?: {
      cause?: Error;
    }
  ) {
    const jsonContext = JSON.stringify(
      context,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (key === 'resource' && 'data' in value) {
            return value.data;
          }
        }
        return value;
      },
      2
    );

    const message = `The following request was denied by Firestore Security Rules:\n${jsonContext}`;

    super(message, options);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.cause = options?.cause;
    
    // This is to make the error visible in the Next.js overlay
    this.digest = `${this.name}: ${this.message}`;
  }
}
