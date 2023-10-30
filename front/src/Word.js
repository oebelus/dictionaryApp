export default function Word( {className, name, value, placeholder, onChange} ) {
  return (
    <input 
      type="text"
      className={className}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      />
  );
}
