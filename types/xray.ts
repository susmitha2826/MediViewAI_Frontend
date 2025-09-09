export interface XrayAnalysis {
  id: string;
  imageUrl: string[];
  createdAt: string;
  imageUrls: string[];
  analysisResult: any;
  timestamp:any;
  result: Record<string, number>;
}

export interface AnalysisResult {
  status: string;
  Message: string;
  data: string;
  analysisResult:any;
  msg: any;
}