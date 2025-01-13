export interface DataTableProps {
  columns: (keyof IncomeStatement)[];
  initialData: IncomeStatement[] | null;
}

export interface FilterSortParams {
  sort_field?: string;
  ascending?: boolean;
  fields: {
    [key: string]: {
      min?: number;
      max?: number;
    };
  };
}

export interface LineChartProps {
  data: IncomeStatement[];
  selectedMetrics: NumericIncomeStatementKeys[];
  chartType?: "line" | "stack" | "area";
}
export interface HeaderProps {
  company: CompanyProfile;
  onCompanyChange: (symbol: string) => void;
}

export interface LoadingScreenProps {
  isLoading: boolean;
  onLoaded: () => void;
}

export interface IncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
  link: string;
  finalLink: string;
}

export type IncomeStatementArray = IncomeStatement[];

export type NumericIncomeStatementKeys = keyof Omit<
  IncomeStatement,
  | "date"
  | "symbol"
  | "reportedCurrency"
  | "cik"
  | "fillingDate"
  | "acceptedDate"
  | "calendarYear"
  | "period"
  | "link"
  | "finalLink"
>;

export const colorMap: Record<NumericIncomeStatementKeys, string> = {
  revenue: "#5a2d8c", // Dark Purple
  costOfRevenue: "#c19ed2", // Lavender
  grossProfit: "#9b59b6", // Dusty Purple
  grossProfitRatio: "#FFD700", // Gold
  researchAndDevelopmentExpenses: "#8A2BE2", // BlueViolet
  generalAndAdministrativeExpenses: "#FF6347", // Tomato
  sellingAndMarketingExpenses: "#00CED1", // DarkTurquoise
  sellingGeneralAndAdministrativeExpenses: "#FF4500", // OrangeRed
  otherExpenses: "#2E8B57", // SeaGreen
  operatingExpenses: "#FF1493", // DeepPink
  costAndExpenses: "#D2691E", // Chocolate
  interestIncome: "#8B4513", // SaddleBrown
  interestExpense: "#A52A2A", // Brown
  depreciationAndAmortization: "#B22222", // FireBrick
  ebitda: "#32CD32", // LimeGreen
  ebitdaratio: "#C71585", // MediumVioletRed
  operatingIncome: "#d6bfe3", // Light Purple
  operatingIncomeRatio: "#FF8C00", // DarkOrange
  totalOtherIncomeExpensesNet: "#ADFF2F", // GreenYellow
  incomeBeforeTax: "#8B0000", // DarkRed
  incomeBeforeTaxRatio: "#C71585", // MediumVioletRed
  incomeTaxExpense: "#FFD700", // Gold
  netIncome: "#7f429a", // Purple
  netIncomeRatio: "#FF1493", // DeepPink
  eps: "#4b0082", // Indigo
  epsdiluted: "#9932CC", // DarkOrchid
  weightedAverageShsOut: "#7FFF00", // Chartreuse
  weightedAverageShsOutDil: "#C0C0C0", // Silver
};

export interface CompanyProfile {
  symbol: string;
  price: string;
  marketCap: string;
  beta: string;
  lastDividend: string;
  range: string;
  change: string;
  changePercentage: string;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchangeFullName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  ipoDate: string;
  defaultImage: string;
  isEtf: string;
  isActivelyTrading: string;
  isAdr: string;
  isFund: string;
}

export type CompanyProfileArray = CompanyProfile[];
