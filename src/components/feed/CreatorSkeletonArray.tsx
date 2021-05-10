import CreatorCardSkeleton from 'components/cards/creator/CreatorCardSkeleton';

export default function CreatorSkeletonArray(): JSX.Element {
  const emptyArray = new Array(20).fill(null);
  return (
    <>
      {emptyArray.map((_, key) => (
        <CreatorCardSkeleton key={key} />
      ))}
    </>
  );
}
