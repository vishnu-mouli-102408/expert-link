import { j } from "./jstack";
import { accountRouter } from "./routers/account-router";
import { authRouter } from "./routers/auth-router";
import { healthCheckRouter } from "./routers/health-check-router";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  // For importing heavy router dynamically
  // auth: dynamic(() => import("./routers/auth-router")),
  auth: authRouter,
  health: healthCheckRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
