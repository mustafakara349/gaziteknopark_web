const DEPARTMENTS = [
  {
    id: "tto",
    title: "Teknoloji Transfer Ofisi (TTO)",
    description: "Üniversite-Sanayi İşbirliği, Patent, Fikri Mülkiyet Hakları ve Lisanslama",
    email: "tto@gaziteknopark.com.tr",
    extension: "Dahili: 102 / 103",
    icon: (
      <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "kulucka",
    title: "Girişimcilik & Kuluçka Merkezi",
    description: "Ön Kuluçka, Kuluçka Programları, Hızlandırıcı, Mentörlük ve Yatırımcı Ağı",
    email: "kulucka@gaziteknopark.com.tr",
    extension: "Dahili: 104 / 105",
    icon: (
      <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "proje",
    title: "Proje Yönetimi & Ar-Ge Danışmanlığı",
    description: "TÜBİTAK, KOSGEB, Ticaret Bakanlığı Destekleri ve Proje Başvuru Takibi",
    email: "proje@gaziteknopark.com.tr",
    extension: "Dahili: 108 / 109",
    icon: (
      <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "yonetim",
    title: "Yönetim & İdari İşler",
    description: "Genel Müdürlük, Şirket Kabul Süreçleri, Muafiyet Onayları ve Alan Tahsisleri",
    email: "idari@gaziteknopark.com.tr",
    extension: "Dahili: 100 / 101",
    icon: (
      <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4m-4-4l-4 4" />
      </svg>
    ),
  },
];

export default function ContactDepartments() {
  return (
    <div className="mt-12">
      <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Kurumsal Dizin</span>
          <h2 className="mt-1 text-xl font-extrabold text-primary sm:text-2xl">Birimler ve İrtibat Hatları</h2>
        </div>
        <p className="text-xs text-gray-500 max-w-md">
          Aradığınız konuya ilişkin doğru birime doğrudan ulaşarak işlemlerinizi hızlandırabilirsiniz.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                {dept.icon}
              </div>
              <h3 className="mt-3 text-sm font-bold text-primary">{dept.title}</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{dept.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-semibold text-primary">{dept.extension}</span>
              </div>
              <a
                href={`mailto:${dept.email}`}
                className="mt-1 block truncate font-medium text-accent-blue hover:underline"
              >
                {dept.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
