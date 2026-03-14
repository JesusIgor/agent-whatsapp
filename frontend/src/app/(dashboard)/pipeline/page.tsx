import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { PipelineBoard } from '@/components/organisms/PipelineBoard'

export default function PipelinePage() {
  return (
    <DashboardLayout
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-2xl border border-[#727B8E]/10 dark:border-[#454a54] bg-white shadow-lg sm:rounded-3xl"
      >
        <PipelineBoard />
      </motion.div>
    </DashboardLayout>
  )
}
