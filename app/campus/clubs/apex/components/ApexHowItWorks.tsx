'use client';

import DomainFolders from '@/components/DomainFolders';

export default function ApexHowItWorks({
  sectionRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
      <DomainFolders
        accentColor="#D80000"
        eyebrow="How it works"
        headline="Five domains. One community."
      />
    </div>
  );
}
