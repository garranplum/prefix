import {z} from "zod"

import {createTRPCRouter, publicProcedure} from "~/server/api/trpc"

export const workOrderRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ctx}) =>
  {
    return ctx.db.workOrder.findMany({
      include: {
        customer: true,
      },
    })
  }),

  getById: publicProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) =>
    {
      return ctx.db.workOrder.findUnique({
        where: {id: input.id},
        include: {
          customer: true,
          vendors: {
            include: {
              vendor: true,
            },
          },
        },
      })
    }),

  create: publicProcedure
    .input(z.object({nickName: z.string().min(1), scopeOfWork: z.string().min(1), budget: z.number(), customerId: z.number()}))
    .mutation(async ({ctx, input}) =>
    {
      try
      {
        const workOrder = await ctx.db.workOrder.create({
          data: {
            nickName: input.nickName,
            scopeOfWork: input.scopeOfWork,
            budget: input.budget,
            createdAt: new Date(),
            updatedAt: new Date(),
            customerId: input.customerId,
          },
        })

        return workOrder

      } catch (error: unknown)
      {
        throw new Error(error instanceof Error ? error.message : "Failed to create work order")
      }
    }),
})
