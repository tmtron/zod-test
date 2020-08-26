import { ZodType } from 'zod';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * just a placeholder type to easily find places where the
 * zod InternalCheck<T> type should be used (but cannot be used, because it is not exported)
 */
export type ZodInternalCheck = any;

export type HandleUnsupportedFct = (msg: string) => undefined | never | void;

export type GetOpenApiSchemaTypeFct = (
  ctx: ZtoContext,
  zodType: ZodType<any>,
) => SchemaObject | undefined;

export class ZtoContext {
  constructor(
    readonly handleUnsupportedFct: HandleUnsupportedFct,
    private readonly getOpenApiSchemaTypeFct: GetOpenApiSchemaTypeFct,
  ) {}

  handleUnsupported(msg: string): undefined | never {
    this.handleUnsupportedFct(msg);
    return undefined;
  }

  getOpenApiSchemaType(zodType: ZodType<any>) {
    return this.getOpenApiSchemaTypeFct(this, zodType);
  }
}
