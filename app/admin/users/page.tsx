"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Shield, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Crown,
  User,
  FileText,
  Eye
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'writer' | 'contributor'
  status: 'active' | 'inactive' | 'suspended'
  avatar_url?: string
  phone?: string
  last_login?: string
  created_at: string
  permissions: string[]
  articles_count: number
  login_count: number
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'أحمد المدير',
    email: 'admin@zawaya.org',
    role: 'super_admin',
    status: 'active',
    avatar_url: '/placeholder-user.jpg',
    phone: '+966501234567',
    last_login: '2025-01-25T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    permissions: ['all'],
    articles_count: 0,
    login_count: 248
  },
  {
    id: '2',
    name: 'سارة بلقاسمي',
    email: 'sara@zawaya.org',
    role: 'editor',
    status: 'active',
    avatar_url: '/placeholder-user.jpg',
    phone: '+966507654321',
    last_login: '2025-01-25T09:15:00Z',
    created_at: '2024-02-15T00:00:00Z',
    permissions: ['articles:write', 'articles:edit', 'articles:publish'],
    articles_count: 24,
    login_count: 156
  },
  {
    id: '3',
    name: 'نور حداد',
    email: 'nour@zawaya.org',
    role: 'writer',
    status: 'active',
    avatar_url: '/placeholder-user.jpg',
    last_login: '2025-01-24T16:45:00Z',
    created_at: '2024-03-10T00:00:00Z',
    permissions: ['articles:write', 'articles:edit'],
    articles_count: 18,
    login_count: 89
  },
  {
    id: '4',
    name: 'محمد الحكيم',
    email: 'mohammed@zawaya.org',
    role: 'contributor',
    status: 'active',
    phone: '+966509876543',
    last_login: '2025-01-23T14:20:00Z',
    created_at: '2024-04-05T00:00:00Z',
    permissions: ['programs:create', 'episodes:create'],
    articles_count: 0,
    login_count: 67
  },
  {
    id: '5',
    name: 'فاطمة الكاتبة',
    email: 'fatima@zawaya.org',
    role: 'writer',
    status: 'suspended',
    last_login: '2025-01-15T11:30:00Z',
    created_at: '2024-05-20T00:00:00Z',
    permissions: ['articles:write'],
    articles_count: 7,
    login_count: 23
  }
]

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4" />
      case 'admin': return <Shield className="w-4 h-4" />
      case 'editor': return <Edit className="w-4 h-4" />
      case 'writer': return <FileText className="w-4 h-4" />
      case 'contributor': return <User className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      super_admin: 'مدير عام',
      admin: 'مدير',
      editor: 'محرر',
      writer: 'كاتب',
      contributor: 'مساهم'
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  const getRoleBadge = (role: string) => {
    const roleStyles = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-blue-100 text-blue-800',
      writer: 'bg-green-100 text-green-800',
      contributor: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={`${roleStyles[role as keyof typeof roleStyles]} flex items-center space-x-1 space-x-reverse`}>
        {getRoleIcon(role)}
        <span>{getRoleLabel(role)}</span>
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    }
    
    const statusLabels = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'موقوف'
    }

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    )
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'لم يسجل دخول مطلقاً'
    const date = new Date(lastLogin)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'منذ أقل من ساعة'
    if (diffInHours < 24) return `منذ ${Math.floor(diffInHours)} ساعة`
    if (diffInHours < 168) return `منذ ${Math.floor(diffInHours / 24)} يوم`
    return date.toLocaleDateString('ar-SA')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const deleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
    }
  }

  const roleStats = {
    super_admin: users.filter(u => u.role === 'super_admin').length,
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    writer: users.filter(u => u.role === 'writer').length,
    contributor: users.filter(u => u.role === 'contributor').length
  }

  const statusStats = {
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-600 mt-2">
              إدارة المستخدمين والأذونات ومستويات الوصول
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 ml-2" />
            إضافة مستخدم جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">المستخدمين النشطين</p>
                  <p className="text-2xl font-bold">{statusStats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">المديرين</p>
                  <p className="text-2xl font-bold">{roleStats.super_admin + roleStats.admin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الكُتّاب والمحررين</p>
                  <p className="text-2xl font-bold">{roleStats.editor + roleStats.writer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث بالاسم أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="super_admin">مدير عام</option>
                  <option value="admin">مدير</option>
                  <option value="editor">محرر</option>
                  <option value="writer">كاتب</option>
                  <option value="contributor">مساهم</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
            <CardDescription>
              {filteredUsers.length} من {users.length} مستخدم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                          <AvatarFallback className="text-lg font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>انضم في {new Date(user.created_at).toLocaleDateString('ar-SA')}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">آخر تسجيل دخول:</span> {formatLastLogin(user.last_login)}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">عدد المقالات:</span> {user.articles_count}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">مرات تسجيل الدخول:</span> {user.login_count}
                              </div>
                            </div>
                          </div>

                          {/* Permissions */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">الصلاحيات:</p>
                            <div className="flex flex-wrap gap-2">
                              {user.permissions.map((permission) => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission === 'all' ? 'جميع الصلاحيات' : permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض الملف الشخصي
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            تحرير
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleUserStatus(user.id, user.status)}
                          >
                            {user.status === 'active' ? (
                              <>
                                <Lock className="w-4 h-4 ml-2" />
                                إيقاف المستخدم
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 ml-2" />
                                تفعيل المستخدم
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 ml-2" />
                            إدارة الصلاحيات
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف المستخدم
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 