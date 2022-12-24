import PropTypes from 'prop-types';
import style from './Button.module.css';

const Button = ({ loadMore }) => {
  return (
    <button type="button" onClick={loadMore} className={style.Button}>
      load more
    </button>
  );
};

Button.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default Button;
