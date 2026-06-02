import AdminLayout from '@/components/general/adminLayout'

export default function AdminLayoutWrapper({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}