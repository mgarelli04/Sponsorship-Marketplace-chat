import ChatInbox from "@/components/chat/chat-inbox";

export const dynamic = "force-dynamic";

export default async function CreatorInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const params = await searchParams;
  return <ChatInbox role="creator" selectedThreadId={params.thread ?? null} />;
}
