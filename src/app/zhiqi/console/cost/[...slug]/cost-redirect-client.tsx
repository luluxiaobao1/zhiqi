"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CostCatchAllRedirectPage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        // 你的原有跳转逻辑
    }, []);

    return <div></div>;
}
