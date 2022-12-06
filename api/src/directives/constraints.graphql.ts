import { MapperKind, mapSchema, getDirective } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

export function regexDirectiveTransformer(
    schema: GraphQLSchema,
    directiveName: string
): GraphQLSchema {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const Directive = getDirective(schema, fieldConfig, directiveName)?.[0];

            if (Directive) {
                const { resolve = defaultFieldResolver } = fieldConfig;

                // Replace the original resolver with a function that *first* calls
                // the original resolver, then converts its result to upper case

                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (typeof result === 'string') {
                        console.log('result', result);
                        if (!result.match(String(Directive.pattern))) {
                            throw new Error(`${result} does not match ${Directive.pattern}`);
                        }
                        return result.toUpperCase();
                    }
                    return result;
                };
            }
            return fieldConfig;
        },
    });
}
