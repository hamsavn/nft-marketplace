interface Props {
  onClick?: () => void;
  loading?: boolean;
  isSubmit?: boolean;
  className?: string;
}

export const Button: React.FC<Props> = ({ onClick, children, loading, isSubmit, className }) => {
  return (
    <button
      className={`btn-main ${className || ''}`}
      type={isSubmit ? 'submit' : undefined}
      onClick={(e) => {
        if (!isSubmit) {
          e.preventDefault();
        }

        if (onClick) {
          onClick();
        }
      }}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <span>{children}</span>
      {loading && (
        <div className="ldio-qcn1idhtt5j">
          <div></div>
        </div>
      )}
    </button>
  );
};
