'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Building2,
    Users,
    Star,
    Shield,
    TrendingUp,
    Tag,
    Flag,
    BadgeCheck,
    ArrowRight,
    Eye,
    FileCheck,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/features/analytics/stats-card';

import type { AdminDashboardStats, ChartDataPoint, DistributionItem } from '@/types/admin';
import {
    getAdminDashboardStats,
    getSignupsChartData,
    getCategoryDistribution
} from '@/lib/api/admin';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

// ... (removing mock data constants if possible, or leave them unused)

const mockStats: AdminDashboardStats = {
    totalOrganizations: 0,
    verifiedOrganizations: 0,
    pendingVerifications: 0,
    totalUsers: 0,
    totalReviews: 0,
    activePromotions: 0,
    newUsersThisMonth: 0,
    newOrgsThisMonth: 0,
    pendingReports: 0,
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [signupsData, setSignupsData] = useState<ChartDataPoint[]>([]);
    const [categoryData, setCategoryData] = useState<DistributionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [statsRes, signupsRes, categoryRes] = await Promise.all([
                    getAdminDashboardStats(),
                    getSignupsChartData(30),
                    getCategoryDistribution(),
                ]);
                setStats(statsRes);
                setSignupsData(signupsRes);
                setCategoryData(categoryRes);
            } catch (error) {
                console.error('Failed to load admin dashboard:', error);
                // Fallback to empty or error state
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    const verificationPercentage = stats
        ? Math.round((stats.verifiedOrganizations / stats.totalOrganizations) * 100)
        : 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground mt-1">
                    Vue d'ensemble de la plateforme BusinessBook
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Entreprises"
                    value={stats?.totalOrganizations?.toLocaleString() || '0'}
                    description={`+${stats?.newOrgsThisMonth || 0} ce mois`}
                    icon={Building2}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Entreprises Vérifiées"
                    value={`${stats?.verifiedOrganizations?.toLocaleString() || '0'}`}
                    description={`${verificationPercentage}% du total`}
                    icon={BadgeCheck}
                    className="border-green-200 dark:border-green-900"
                />
                <StatsCard
                    title="Utilisateurs"
                    value={stats?.totalUsers?.toLocaleString() || '0'}
                    description={`+${stats?.newUsersThisMonth || 0} ce mois`}
                    icon={Users}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Avis Publiés"
                    value={stats?.totalReviews?.toLocaleString() || '0'}
                    description="Toutes entreprises"
                    icon={Star}
                />
            </div>

            {/* Pending Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-orange-100 dark:bg-orange-900/50 p-3">
                                    <FileCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats?.pendingVerifications || 0}</p>
                                    <p className="text-sm text-muted-foreground">Vérifications en attente</p>
                                </div>
                            </div>
                            <Link href="/admin/verifications">
                                <Button variant="outline" size="sm" className="border-orange-300">
                                    Voir <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                                    <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats?.activePromotions || 0}</p>
                                    <p className="text-sm text-muted-foreground">Promotions actives</p>
                                </div>
                            </div>
                            <Link href="/admin/organizations?tab=promotions">
                                <Button variant="outline" size="sm" className="border-purple-300">
                                    Gérer <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-3">
                                    <Flag className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats?.pendingReports || 0}</p>
                                    <p className="text-sm text-muted-foreground">Signalements à traiter</p>
                                </div>
                            </div>
                            <Link href="/admin/reports">
                                <Button variant="outline" size="sm" className="border-red-300">
                                    Modérer <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Signups Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Inscriptions
                        </CardTitle>
                        <CardDescription>
                            Nouveaux utilisateurs ces 30 derniers jours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={signupsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                        formatter={(value: any) => [`${value} utilisateurs`, 'Inscriptions']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#3b82f6' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Répartition par catégorie
                        </CardTitle>
                        <CardDescription>
                            Distribution des entreprises
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="h-[200px] w-[200px] min-w-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData as any[]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any, name: any) => [`${value} entreprises`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-2">
                                {categoryData.map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{item.value}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {item.percentage}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/admin/verifications">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Shield className="h-5 w-5 mr-3 text-orange-500" />
                                <div className="text-left">
                                    <p className="font-medium">Vérifier entreprises</p>
                                    <p className="text-xs text-muted-foreground">
                                        {stats?.pendingVerifications} en attente
                                    </p>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/admin/users">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Users className="h-5 w-5 mr-3 text-blue-500" />
                                <div className="text-left">
                                    <p className="font-medium">Gérer utilisateurs</p>
                                    <p className="text-xs text-muted-foreground">
                                        {stats?.totalUsers?.toLocaleString() || '0'} inscrits
                                    </p>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/admin/categories">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Building2 className="h-5 w-5 mr-3 text-green-500" />
                                <div className="text-left">
                                    <p className="font-medium">Gérer catégories</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ajouter, modifier, réorganiser
                                    </p>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/admin/reports">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Flag className="h-5 w-5 mr-3 text-red-500" />
                                <div className="text-left">
                                    <p className="font-medium">Modération</p>
                                    <p className="text-xs text-muted-foreground">
                                        Traiter les signalements
                                    </p>
                                </div>
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            className="w-full justify-start h-auto py-4"
                            onClick={async () => {
                                if (confirm('Êtes-vous sûr de vouloir réindexer toutes les entreprises ? Cette opération peut prendre du temps.')) {
                                    try {
                                        const { reindexOrganizations } = await import('@/lib/api/admin');
                                        const res = await reindexOrganizations();
                                        alert(`Succès: ${res.message}. ${res.indexedCount} entreprises indexées.`);
                                    } catch (e) {
                                        console.error(e);
                                        alert('Erreur lors de la réindexation.');
                                    }
                                }
                            }}
                        >
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-1 mr-3">
                                {/* Using existing Lucide icon, imported below or inline if possible? No, must be imported. */}
                                {/* I'll rely on text for now or add the icon import in a separate call if needed. */}
                                {/* Actually, let's use a generic icon that is likely already imported or easily added. */}
                                {/* Building2 is already imported. I'll use that as a placeholder or add RefreshCw in imports. */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-600 dark:text-blue-400"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                            </div>
                            <div className="text-left">
                                <p className="font-medium">Réindexer Search</p>
                                <p className="text-xs text-muted-foreground">
                                    Mettre à jour l'index Elasticsearch
                                </p>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AdminDashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-5 w-72 mt-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-16 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
