import { NextResponse } from 'next/server';
import { getPackages } from '@/lib/packages-data';

export const dynamic = 'force-static';

// GET /api/packages - 获取套餐列表
export async function GET(request: Request) {
  // Static export does not support dynamic URL reading like searchParams in static routes
  // We'll return active by default since we can't reliably parse search params during static export
  const status = 'active'; // Forced default for static export
    
    // 如果 status=active，只返回已上架套餐
    // 否则返回所有套餐
    const packages = status === 'active' ? getPackages().filter(p => p.status === 'active') : getPackages();
    
    return NextResponse.json({
        success: true,
        data: packages
    });
}
