import { useEffect, useRef, useState } from "react";
import { getTeamMembers } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import EmptyState from "../components/common/EmptyState";
import { LinkedinIcon, MailIcon, UserIcon } from "../components/common/icons";

function toPerson(member) {
  const t = pickTranslation(member);
  return {
    id: member.id,
    parentId: member.parentId,
    isUnit: member.isUnit,
    fullName: member.fullName,
    title: t.title,
    email: member.email,
    linkedinUrl: member.linkedinUrl,
    children: []
  };
}

function buildTree(members) {
  const byId = new Map(members.map((m) => [m.id, toPerson(m)]));
  const roots = [];
  for (const person of byId.values()) {
    if (person.parentId && byId.has(person.parentId)) {
      byId.get(person.parentId).children.push(person);
    } else {
      roots.push(person);
    }
  }
  return roots;
}

function UnitCard({ person }) {
  return (
    <div className="flex h-16 w-36 items-center justify-center rounded-xl border border-blue-100/80 bg-gradient-to-r from-[#d6e6f7] via-[#e8f1fa] to-[#d6e6f7] px-3 py-2 text-center shadow-sm">
      <h3 className="line-clamp-2 text-[11px] font-bold leading-snug text-primary">{person.fullName}</h3>
    </div>
  );
}

function PersonCard({ person, accent, large }) {
  return (
    <div
      className={`flex w-36 flex-col items-center px-3 py-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        large ? "w-44 py-5" : "w-36 py-4"
      } ${accent ? "rounded-xl border-t-[3px] border-primary bg-white" : "rounded-xl border border-gray-100 bg-white"}`}
    >
      <div
        className={`mx-auto flex shrink-0 items-center justify-center rounded-full bg-surface text-gray-300 ring-2 ring-white shadow-inner ${
          large ? "h-16 w-16" : "h-12 w-12"
        }`}
      >
        <UserIcon className={large ? "h-8 w-8" : "h-6 w-6"} />
      </div>
      <h3 className={`mt-2 line-clamp-2 font-bold leading-snug text-primary ${large ? "text-sm" : "text-xs"}`}>
        {person.fullName}
      </h3>
      {person.title && (
        <p className={`mt-0.5 line-clamp-2 leading-snug text-gray-500 ${large ? "text-xs" : "text-[11px]"}`}>
          {person.title}
        </p>
      )}
      {(person.email || person.linkedinUrl) && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className={`flex items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-primary hover:text-white ${
                large ? "h-7 w-7" : "h-6 w-6"
              }`}
            >
              <MailIcon className="h-3 w-3" />
            </a>
          )}
          {person.linkedinUrl && (
            <a
              href={person.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-primary hover:text-white ${
                large ? "h-7 w-7" : "h-6 w-6"
              }`}
            >
              <LinkedinIcon className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function OrgNode({ person, depth = 0 }) {
  const hasChildren = person.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="h-4 w-px bg-gray-300" />
      {person.isUnit ? (
        <UnitCard person={person} />
      ) : (
        <PersonCard person={person} accent={hasChildren} large={depth < 2} />
      )}

      {hasChildren && (
        <div className="mt-5 flex items-start gap-x-3 border-t border-gray-300 pt-5">
          {person.children.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute -top-5 left-1/2 h-5 w-px -translate-x-1/2 bg-gray-300" />
              <OrgNode person={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    getTeamMembers().then(setMembers).catch(() => setMembers([]));
  }, []);

  const roots = buildTree(members);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [members]);

  return (
    <div className="py-10">
      {roots.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4">
          <EmptyState />
        </div>
      ) : (
        <div ref={scrollRef} className="overflow-x-auto px-4 pb-4">
          <div className="flex w-fit items-start gap-16 mx-auto">
            {roots.map((root) => (
              <OrgNode key={root.id} person={root} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
