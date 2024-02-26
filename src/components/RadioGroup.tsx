import { Image, Link, MessageCircleMore, PlaySquare } from "lucide-react";

interface RadioOption {
  value: string;
  label: string;
}
interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
}) => {
  function renderIcon(optionValue: string) {
    switch (optionValue) {
      case "text":
        return (
          <MessageCircleMore size={32} className="w-12 h-12 mx-auto mb-2" />
        );
      case "image":
        return <Image size={32} className="w-12 h-12 mx-auto mb-2" />;
      case "video":
        return <PlaySquare className="w-12 h-12 mx-auto mb-2" />;
      default:
        return <Link size={32} className="w-12 h-12 mx-auto mb-2" />;
    }
  }
  return (
    <>
      <h1 className="mb-2">ประเภทของคอนเทนต์</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {options.map((option) => (
          <label
            className={`${
              selectedValue === option.value
                ? " bg-white text-[#B28A4C] "
                : "bg-[#B28A4C] text-white"
            } border-2 border-[#B28A4C]  text-center p-2 h-[100px] rounded-lg cursor-pointer`}
            key={option.value}
          >
            {renderIcon(option.value)}
            <input
              className="hidden"
              type="radio"
              name={name} // Important for grouping!
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </>
  );
};

export default RadioGroup;
