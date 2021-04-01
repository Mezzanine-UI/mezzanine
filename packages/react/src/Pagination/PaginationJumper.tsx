import {
  forwardRef,
  DetailedHTMLProps,
  HTMLAttributes,
  useState,
  KeyboardEvent,
} from 'react';
import { paginationJumperClasses as classes } from '@mezzanine-ui/core/pagination';
import Typography from '../Typography';
import Button from '../Button';
import Input from '../Input';
import { cx } from '../utils/cx';

export interface PaginationJumperProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onChange'> {
  /**
   * The text displayed in the `button` content.
   */
  buttonText?: string;
  /**
   * If `true`, the pagination jumper fields is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The hint text displayed in front of `input`.
   */
  hintText?: string;
  /**
   * The hint displayed in the `input` before the user enters a value.
   */
  inputPlaceholder?: string;
  /**
   * Callback fired when the page is changed.
   *
   * @param {number} page The page active.
   */
  onChange?: (page: number) => void;
  /**
   * Number of data per page
   * @default 5
   */
  pageSize?: number;
  /**
   * Items total count.
   * @default 0
   */
  total?: number;
}

const PaginationJumper = forwardRef<HTMLDivElement, PaginationJumperProps>((props, ref) => {
  const {
    buttonText,
    className,
    disabled = false,
    hintText,
    inputPlaceholder,
    onChange: handleChange,
    pageSize = 5,
    total = 0,
    ...rest
  } = props;

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const totalPages = (total ? Math.ceil(total / pageSize) : 1);

  const valueValidator = () => {
    const stringToNumber = +value;
    const validNumber = !!stringToNumber;

    if (validNumber) {
      return !(stringToNumber > totalPages || stringToNumber < 1);
    }

    return false;
  };

  const handleClick = () => {
    const valid = valueValidator();

    if (valid) {
      setError(false);

      if (handleChange) {
        handleChange(+value);
        setValue('');
      }
    } else {
      setError(true);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
    >
      <Typography
        color={disabled ? 'text-disabled' : 'text-primary'}
        component="div"
        ellipsis
        variant="input2"
      >
        {hintText}
      </Typography>
      <Input
        disabled={disabled}
        error={error}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={inputPlaceholder}
        inputProps={{
          type: 'number',
          className: classes.input,
          onKeyDown: handleKeyDown,
        }}
        value={value}
      />
      <Button
        disabled={disabled}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
});

export default PaginationJumper;
