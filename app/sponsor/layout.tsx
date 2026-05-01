import SponsorHeader from "@/components/layout/sponsor-header";

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SponsorHeader />
      {children}
    </>
  );
}
