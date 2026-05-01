import CreatorHeader from "@/components/layout/creator-header";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreatorHeader />
      {children}
    </>
  );
}
