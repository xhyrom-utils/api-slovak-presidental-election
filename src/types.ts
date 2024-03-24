export interface Candidate {
  first_name: string;
  last_name: string;
  title: string;
  votes: number;
  votes_percentage: number;
}

export interface District {
  name: string;
  votes: number;
  votes_percentage: number;
  attendance: number;
}

export interface Region {
  votes: number;
  votes_percentage: number;
  attendance: number;
  candidates: Candidate[];
  districts: District[];
}

export interface Slovakia {
  data: {
    votes: number;
    votes_percentage: number;
    attendance: number;
  };
  whole: Candidate[];
}

export type SlovakiaAndRegions = Slovakia & {
  regions: Record<string, Region>;
};
