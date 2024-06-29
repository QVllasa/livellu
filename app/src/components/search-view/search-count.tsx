

interface Props {
  from: number;
  to: number;
  total: number;
}

const SearchCount = ({ from, to, total }: Props) => {
  

  return (
    <span className="text-sm font-semibold text-heading">{`${(
      'text-showing'
    )} ${from} - ${to} ${('text-of')} ${total} ${('text-products')}`}</span>
  );
};

export default SearchCount;
