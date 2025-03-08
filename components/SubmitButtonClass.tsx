interface SubmitButtonProps {
  handleSubmit: () => void;
  disabled?: boolean; // Make it optional
}

export default function SubmitButton({ handleSubmit, disabled = false }: SubmitButtonProps) {
  return (
    <button className="btn btn-primary w-full mt-4" onClick={handleSubmit} disabled={disabled}>
      {disabled ? 'Submitting...' : 'Submit'}
    </button>
  );
}
