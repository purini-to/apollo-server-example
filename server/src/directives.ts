import { DirectiveResolvers } from "./generated/graphql";

const directives: DirectiveResolvers = {
  upper: async (next) => {
    const res = await next();
    if (typeof res === "string") {
      return res.toUpperCase();
    }
    return res;
  },
};

export default directives;
