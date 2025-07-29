import UnderConstructionPage from "../under-construction";

function CustomersPage() {
  return (
    <UnderConstructionPage
      title="Rol Yönetimi Yapım Aşamasında 🚧"
      description="Rol yönetimi geliştirme aşamasındadır. Yakında hizmetinizde olacaktır."
      progress={10}
      estimatedTime="8 Hafta"
      returnPath="/admin"
    />
  );
}

export default CustomersPage;
