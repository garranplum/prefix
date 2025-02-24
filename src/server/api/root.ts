import {createCallerFactory, createTRPCRouter} from "~/server/api/trpc"
import {workOrderRouter} from "./routers/workOrder"
import {vendorRouter} from "./routers/vendor"
import {customerRouter} from "./routers/customer"
import {workOrderAssignmentRouter} from "./routers/workOrderAssignment"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workOrder: workOrderRouter,
  vendor: vendorRouter,
  customer: customerRouter,
  workOrderAssignment: workOrderAssignmentRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
