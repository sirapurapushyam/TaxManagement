const GenderBadge = ({ gender }) => {
  const normalizedGender = gender?.toLowerCase() || '';
  const isMale = normalizedGender === 'male';
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isMale
          ? 'bg-blue-50 text-blue-600 border border-blue-200'
          : 'bg-pink-50 text-pink-600 border border-pink-200'
      }`}
    >
      {gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : '-'}
    </span>
  );
};

export default GenderBadge;