'use client';

interface InputComponentProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const InputComponent = ({ label, value, onChange }: InputComponentProps) => (
  <div className="flex size-full flex-col gap-4">
    <label
      htmlFor={label}
      className="text-2xl font-bold"
    >
      {label}
    </label>
    <input
      type="text"
      id={label}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="border-1 border-slate-500"
    />
  </div>
);

export default InputComponent;
