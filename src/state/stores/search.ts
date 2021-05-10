import create from 'zustand';
import { AlgoliaArtworkAvailability } from 'types/Algolia';

export interface SearchState {
  searchTerm: string;
  isLoading: boolean;
  artworkAvailabilities: string[];
  setSearchLoading: (value: boolean) => void;
  setArtworkAvailabilities: (value: string[]) => void;
}

const useSearchState = create<SearchState>((set) => ({
  isLoading: true,
  searchTerm: '',
  artworkAvailabilities: [
    AlgoliaArtworkAvailability.LIVE_AUCTION,
    AlgoliaArtworkAvailability.RESERVE_NOT_MET,
  ],
  setSearchLoading: (value) => set({ isLoading: value }),
  setArtworkAvailabilities: (value) => set({ artworkAvailabilities: value }),
}));

export default useSearchState;
