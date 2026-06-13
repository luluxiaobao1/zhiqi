import ChatClient from './chat-client';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}

export default function ChatPage() {
  return <ChatClient />;
}
