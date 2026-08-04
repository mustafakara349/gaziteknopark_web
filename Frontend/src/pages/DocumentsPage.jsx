import PageSection from "../components/common/PageSection";
import DocumentList from "../components/documents/DocumentList";

export default function DocumentsPage() {
  return (
    <div>
      <PageSection className="!py-6">
        <div className="-mt-2 mb-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          Sitemizde yer alan mevzuat ve belgeleri inceleyebilirsiniz.
        </div>
        <DocumentList />
      </PageSection>
    </div>
  );
}

