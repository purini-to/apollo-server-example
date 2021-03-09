import formatISO from "date-fns/formatISO";
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from "graphql";

const config: GraphQLScalarTypeConfig<Date, string> = {
  name: "DateTime",
  description: "DateTime custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return formatISO(value);
    }
    return null;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    } else if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
};
export default new GraphQLScalarType(config);
