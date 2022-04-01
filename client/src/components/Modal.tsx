interface Props {
  active: boolean;
}

export const Modal: React.FC<Props> = ({ active, children }) => {
  if (!active) {
    return null;
  }

  return (
    <div className="checkout">
      <div className="maincheckout" style={{ minHeight: 350 }}>
        {/* <button
              className="btn-close"
            >
              x
            </button> */}

        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            flexDirection: 'column',
          }}
        >
          <div>{children}</div>
          <div
            className="ldio-qcn1idhtt5j"
            style={{ position: 'relative', right: 'auto', transform: 'scale(2)', top: 35 }}
          >
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
