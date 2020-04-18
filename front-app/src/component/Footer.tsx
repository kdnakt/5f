import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      position: 'absolute',
      bottom: 0,
      height: '60px',
      lineHeight: '60px',
      backgroundColor: '#f5f5f5'
    }}>
      Copyright © 2020 <a href='https://twitter.com/kdnakt'>kdnakt</a>
    </footer>
  )
}

export default Footer;