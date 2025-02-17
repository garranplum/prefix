import {z} from "zod"
import {createTRPCRouter, publicProcedure} from "../trpc"

export const workOrderAssignmentRouter = createTRPCRouter({
    // Assign one or more vendors to a work order
    assignVendors: publicProcedure
        .input(z.object({
            workOrderId: z.number(),
            vendorIds: z.array(z.number())
        }))
        .mutation(async ({ctx, input}) =>
        {
            const {workOrderId, vendorIds} = input

            // Create assignments for each vendor
            const assignments = await Promise.all(
                vendorIds.map(vendorId =>
                    ctx.db.vendorWorkOrder.create({
                        data: {
                            workOrderId,
                            vendorId,
                        },
                    })
                )
            )

            return assignments
        }),

    // Reassign a work order from one vendor to another
    reassignVendor: publicProcedure
        .input(z.object({
            workOrderId: z.number(),
            oldVendorId: z.number(),
            newVendorId: z.number()
        }))
        .mutation(async ({ctx, input}) =>
        {
            const {workOrderId, oldVendorId, newVendorId} = input

            // Remove old assignment
            await ctx.db.vendorWorkOrder.deleteMany({
                where: {
                    workOrderId,
                    vendorId: oldVendorId,
                },
            })

            // Create new assignment
            return ctx.db.vendorWorkOrder.create({
                data: {
                    workOrderId,
                    vendorId: newVendorId,
                },
            })
        }),

    // Get all vendors assigned to a work order
    getWorkOrderVendors: publicProcedure
        .input(z.object({
            workOrderId: z.number()
        }))
        .query(async ({ctx, input}) =>
        {
            return ctx.db.vendorWorkOrder.findMany({
                where: {
                    workOrderId: input.workOrderId,
                },
                include: {
                    vendor: true,
                },
            })
        }),
}) 