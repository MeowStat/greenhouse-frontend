interface SpinProps {
  loading?: boolean
}

const Spin: React.FC<SpinProps> = ( props ) => {
  const { loading } = props;
  return (
    loading && 
    <div 
      className="m-4 w-8 h-8 rounded-full animate-spin border-6 border-dashed border-green-400 border-t-transparent">
    </div>
  )
}

export default Spin