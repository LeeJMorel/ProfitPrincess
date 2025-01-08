export interface CompanyProfile {
  symbol: string;
  companyName: string;
  image: string;
  industry: string;
}

export interface HeaderProps {
  company: CompanyProfile;
  onCompanyChange: (symbol: string) => void;
}
