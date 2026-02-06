
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

interface FeatureFlag {
  isEnabled: boolean;
}

/**
 * A hook to check if a feature is enabled via Firestore.
 * @param featureName The name of the feature flag document in the 'feature_flags' collection.
 * @returns An object with the loading state and whether the feature is enabled.
 */
export function useFeatureFlag(featureName: string) {
  const firestore = useFirestore();

  const featureFlagRef = useMemoFirebase(
    () => (firestore ? doc(firestore, `feature_flags/${featureName}`) : null),
    [firestore, featureName]
  );

  const { data: featureFlagDoc, isLoading } = useDoc<FeatureFlag>(featureFlagRef);

  // Default to false if the document doesn't exist or is loading.
  // This is a safe default, ensuring features are off unless explicitly enabled.
  return {
    isEnabled: featureFlagDoc?.isEnabled ?? false,
    isLoading,
  };
}
