
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext) {
    super(
      `Firestore Permission Error: Insufficient permissions for ${context.operation} on ${context.path}`
    );
    this.name = 'FirestorePermissionError';
  }

  toString() {
    return JSON.stringify(
      {
        message: this.message,
        context: this.context,
      },
      null,
      2
    );
  }
}
