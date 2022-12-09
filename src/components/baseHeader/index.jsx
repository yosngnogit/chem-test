import './index.less'

function BaseHeader(text, tiptitle) {
  return <div className="info-title">
    {/* <span className='info-span'>*</span> */}
    <p className='title'>{text}</p>
    <p className='tip-title'>{tiptitle}</p>
  </div>
}
export default BaseHeader