export interface Expert {
  id: string;
  firstName: string | null;
  lastName: string | null;
  expertise: string | null;
  bio: string | null;
  profilePic: string | null;
  hourlyRate: string | null;
  skills: string[];
  yearsOfExperience: string | null;
  certifications: string | null;
  availability: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface SearchExpertsResult {
  experts: Expert[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  code: number;
}
