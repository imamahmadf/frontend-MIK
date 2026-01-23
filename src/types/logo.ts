export interface JenisLogo {
  id: number;
  nama: string;
}

export interface Logo {
  id: number;
  jenisLogoId: number;
  gambarLogo: string;
  jenisLogo?: JenisLogo;
  createdAt: string;
  updatedAt: string;
}

export interface LogoResponse {
  success: boolean;
  data: Logo;
  message?: string;
}

export interface LogoListResponse {
  success: boolean;
  data: Logo[];
  message?: string;
}

export interface JenisLogoResponse {
  success: boolean;
  data: JenisLogo[];
  message?: string;
}

export interface CreateLogoData {
  jenisLogoId: number;
  gambarLogo: File;
}

export interface UpdateLogoData {
  jenisLogoId?: number;
  gambarLogo?: File;
}

