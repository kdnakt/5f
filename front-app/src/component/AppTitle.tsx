import React from 'react';

const AppTitle: React.FC = () => {
  return (
    <>
      <h3>{`${process.env.REACT_APP_OGP_TITLE}`}</h3>
    </>
  );
}

export default AppTitle;
