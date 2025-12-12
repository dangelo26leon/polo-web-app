const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
      
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-1/2" />
        
        {/* Rating skeleton */}
        <div className="flex items-center mb-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            ))}
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded ml-2 w-8" />
        </div>
        
        {/* Price skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-1 w-24" />
        
        {/* Stock skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-20" />
        
        {/* Quantity selector skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mx-auto" />
      </div>
    </div>
  );
};

export default SkeletonCard;
