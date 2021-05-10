import { useQuery, UseQueryResult } from 'react-query';
import { generatePinataApiKey } from 'queries/uploads';

export interface PinataApiKeyResult {
  JWT: string;
  pinata_api_key: string;
  pinata_api_secret: string;
}

export default function useGeneratePinataKey(
  token: string
): UseQueryResult<PinataApiKeyResult, Error> {
  return useQuery(
    ['generatePinataApiKey', { token }],
    () => generatePinataApiKey(token),
    { enabled: Boolean(token) }
  );
}
