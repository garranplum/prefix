import {WorkOrderAssignments} from "~/components/WorkOrderAssignments"

export default function Home()
{
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Work Order Management
        </h1>
        <div className="w-full max-w-2xl bg-white text-black rounded-lg">
          <WorkOrderAssignments />
        </div>
      </div>
    </main>
  )
}
