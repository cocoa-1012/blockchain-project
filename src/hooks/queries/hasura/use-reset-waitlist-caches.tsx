import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { QueryCacheKey } from 'types/Queries';

export default function useResetWaitlistCaches(): () => void {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // blow out all-users to include new user
    queryClient.invalidateQueries('waitlistUsers');
    // Blow out user votes cache after joining waitlist
    queryClient.invalidateQueries('usedVotes');
    // On join blow out current user cache
    queryClient.invalidateQueries(QueryCacheKey.User);
    queryClient.invalidateQueries('getWaitlistUser');
  }, [queryClient]);
}
