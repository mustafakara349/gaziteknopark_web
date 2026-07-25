import { useEffect, useState } from "react";
import { getTeamMembers } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";
import { LinkedinIcon } from "../components/common/icons";

export default function TeamMembersPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getTeamMembers().then(setMembers).catch(() => setMembers([]));
  }, []);

  return (
    <div>
      <PageHeader
        title="Yönetim ve Ekip"
        subtitle="Gazi Teknopark'ı yöneten ve geliştiren ekibimizle tanışın."
      />
      <PageSection>
        {members.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {members.map((member) => {
              const t = pickTranslation(member);
              return (
                <div key={member.id} className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="mx-auto h-28 w-28 rounded-full bg-surface" />
                  <h3 className="mt-4 text-sm font-semibold text-[#333]">{member.fullName}</h3>
                  {t.title && <p className="text-xs text-gray-500">{t.title}</p>}
                  {t.bio && <p className="mt-2 line-clamp-3 text-xs text-gray-500">{t.bio}</p>}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
