export interface DetectedObject {
  nameBengali: string;
  nameEnglish: string;
  confidence: 'উচ্চ' | 'মাঝারি' | 'কম' | string;
  location: string;
  description: string;
}

export interface VisualDetails {
  colors: string[];
  lighting: string;
  setting: string;
  detectedText: string;
  sceneType: string;
}

export interface DetectiveReport {
  title: string;
  category: string;
  overallDescription: string;
  detectedObjects: DetectedObject[];
  visualDetails: VisualDetails;
  uncertainties: string[];
  detectiveInsights: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  imageThumbnail: string; // low-res or thumbnail data url
  report: DetectiveReport;
  fileName?: string;
  fileSizeFormatted?: string;
}
