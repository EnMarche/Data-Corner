import { SvgIcon } from '@material-ui/core'
import PropTypes from 'prop-types'

const ListIcon = ({ alt }) => (
  <SvgIcon alt={alt}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H12" stroke="#135CEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H20" stroke="#135CEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18L20 18" stroke="#135CEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </SvgIcon>
)

ListIcon.propTypes = {
  alt: PropTypes.string.isRequired,
}

export default ListIcon
