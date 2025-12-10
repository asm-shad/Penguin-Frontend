interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
  valueClassName?: string;
}

const InfoRow = ({ label, value, icon, valueClassName = "" }: InfoRowProps) => {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1 text-muted-foreground">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-sm ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
};

export default InfoRow;