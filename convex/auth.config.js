export default {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL, // set in the convex dashboard
      applicationID: "convex",
    },
  ],
};
