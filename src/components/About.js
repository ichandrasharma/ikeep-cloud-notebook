import React from 'react'

const About = () => {
  const handleClick = () => {
    window.open('https://github.com/ichandrasharma', '_blank', 'noopener, noreferrer');
  };

  return (
    <div>
      <h4 className='my-2'>Developed by</h4>
      <button onClick={handleClick} className="btn btn-primary">github.com/ichandrasharma</button>
      <h6 className='my-3'>Get source code by clicking above link</h6>
      <br />
      <h6><strong>You can try login with demo account -</strong> mail: 123456@gmail.com, password: 123456</h6>
    </div>
  )
}

export default About
