// /src/types/index.ts

export interface Post {
    id: string;
    PriceTag: string;
    ThumbImage: string;
    thumbnailURL: any;
    BrandTitle: string;
    ProductName: string;
    image?: {
      id: string;
      filename: string;
      mimeType: string;
      filesize: number;
      width: number;
      height: number;
      focalX: number;
      focalY: number;
      sizes: {
        thumbnail: { width: number; height: number; url: string };
        card: { width: number; height: number; url: string };
        tablet: { width: number; height: number; url: string };
      };
      url: string;
      thumbnailURL: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiResponse {
    docs: Post[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }
  