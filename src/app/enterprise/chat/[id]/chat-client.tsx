"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 原有代码保留，仅把 use client 置顶
export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 你的原有逻辑
  }, []);

  return (
    <div>
      {/* 原有页面内容 */}
    </div>
  );
}
