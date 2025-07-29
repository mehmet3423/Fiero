import UnderConstructionPage from "../under-construction";

function BlogsPage() {
  return (
    <UnderConstructionPage
      title="Blog Paneli Yapım Aşamasında 🚧"
      description="Blog yönetim paneli geliştirme aşamasındadır. Yakında hizmetinizde olacaktır."
      progress={10}
      estimatedTime="4 Hafta"
      returnPath="/admin"
    />
  );
}

export default BlogsPage;
