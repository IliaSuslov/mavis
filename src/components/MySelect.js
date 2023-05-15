export function MySelect({ options, value, onChange, label }) {
  return (
    <>
      <p>{label}</p>
      <select value={value} onChange={onChange}>
        <option value="all">All</option>
        {options.map((option, i) => (
          <option value={option.value} key={i}>
            {option.value}
          </option>
        ))}
      </select>
    </>
  );
}
