import ChatInbox from "@/components/chat/chat-inbox";

export const dynamic = "force-dynamic";

export default async function SponsorInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const params = await searchParams;
  return <ChatInbox role="sponsor" selectedThreadId={params.thread ?? null} />;
}
