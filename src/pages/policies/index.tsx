import { NextPage } from "next";
import Image from "next/image";
import SEOHead from "@/components/SEO/SEOHead";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { GeneralContentType } from "@/constants/models/GeneralContent";

const PoliciesPage: NextPage = () => {
  const { contents, isLoading } = useGeneralContents(
    GeneralContentType.Policies
  );

  const policies = contents
    ?.slice()
    ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <SEOHead canonical="/policies" />
      {/* Page Title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">POLİTİKALARIMIZ</div>
        </div>
      </div>

      {/* Main Page */}
      <section className="flat-spacing-25">
        <div className="container">
          <div className="mb-5 p-5 bg-white shadow rounded">
            {isLoading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : policies && policies.length > 0 ? (
              <div>
                {policies.map((policy, index) => (
                  <div key={policy.id} className="pb-3 mb-4">
                    {/* {policy.imageUrl && (
                      <div className="text-center mb-3">
                        <Image
                          src={policy.imageUrl}
                          alt={policy.title || "Policy Image"}
                          width={800}
                          height={400}
                          className="w-100 h-auto rounded"
                        />
                      </div>
                    )} */}
                    {policy.title && (
                      <h3 className="fs-4 fw-bold text-dark mb-3">
                        {policy.title}
                      </h3>
                    )}
                    {policy.content && (
                      <div
                        className="policy-content text-secondary lh-lg"
                        dangerouslySetInnerHTML={{
                          __html: policy.content.replace(/\n/g, "<br />"),
                        }}
                      />
                    )}
                    {policy.contentUrl && (
                      <div className="mt-3">
                        <a
                          href={policy.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Detaylı Bilgi{" "}
                          <i className="fas fa-external-link-alt ml-2"></i>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i
                  className="fas fa-file-alt mb-3"
                  style={{ fontSize: "3rem", color: "#ccc" }}
                ></i>
                <p className="text-muted">Henüz politika içeriği eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* /Main Page */}

      <style jsx>{`
        .policy-content {
          white-space: pre-line;
        }
      `}</style>
    </>
  );
};

export default PoliciesPage;
