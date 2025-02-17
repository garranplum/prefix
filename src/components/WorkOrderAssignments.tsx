"use client"

import React from "react"
import {api} from "~/trpc/react"

export function WorkOrderAssignments()
{
    const [selectedWorkOrder, setSelectedWorkOrder] = React.useState<number | null>(null)
    const [selectedVendors, setSelectedVendors] = React.useState<number[]>([])

    // Fetch work orders, vendors, and assignments
    const workOrders = api.workOrder.getAll.useQuery()
    const vendors = api.vendor.getAll.useQuery()
    const assignments = api.workOrderAssignment.getWorkOrderVendors.useQuery(
        {workOrderId: selectedWorkOrder ?? 0},
        {enabled: !!selectedWorkOrder}
    )

    // Mutations
    const assignVendors = api.workOrderAssignment.assignVendors.useMutation({
        onSuccess: () =>
        {
            assignments.refetch()
            setSelectedVendors([])
        }
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Work Order Assignments</h1>

            {/* Work Order Selection */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Select Work Order</h2>
                <select
                    className="border p-2 rounded"
                    onChange={(e) => setSelectedWorkOrder(Number(e.target.value))}
                    value={selectedWorkOrder ?? ""}
                >
                    <option value="">Select a work order...</option>
                    {workOrders.data?.map((wo) => (
                        <option key={wo.id} value={wo.id}>
                            {wo.nickName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedWorkOrder && (
                <>
                    {/* Current Assignments */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Current Vendors</h2>
                        {assignments.data?.map((assignment) => (
                            <div key={assignment.id} className="flex items-center gap-2 mb-2">
                                <span>{assignment.vendor.companyName}</span>
                                <span className="text-sm text-gray-500">
                                    ({assignment.status})
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Vendor Assignment */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Assign New Vendors</h2>
                        <div className="flex flex-wrap gap-2">
                            {vendors.data?.map((vendor) => (
                                <label
                                    key={vendor.id}
                                    className="flex items-center gap-2 p-2 border rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedVendors.includes(vendor.id)}
                                        onChange={(e) =>
                                        {
                                            if (e.target.checked)
                                            {
                                                setSelectedVendors([...selectedVendors, vendor.id])
                                            } else
                                            {
                                                setSelectedVendors(selectedVendors.filter(id => id !== vendor.id))
                                            }
                                        }}
                                    />
                                    {vendor.companyName}
                                </label>
                            ))}
                        </div>

                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            disabled={selectedVendors.length === 0}
                            onClick={() =>
                            {
                                if (selectedWorkOrder)
                                {
                                    assignVendors.mutate({
                                        workOrderId: selectedWorkOrder,
                                        vendorIds: selectedVendors
                                    })
                                }
                            }}
                        >
                            Assign Selected Vendors
                        </button>
                    </div>
                </>
            )}
        </div>
    )
} 