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
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'onChange'
  > {
  /**
   * The text displayed in the `button` content.
   */
  buttonText?: string;
  /**
   * If `true`, the pagination jumper fields are disabled.
   */
  disabled?: true;
  /**
   * The hint text displayed in front of input.
   */
  hintText?: string;
  /**
   * The placeholder displayed in the input before the user enters a value.
   */
  inputPlaceholder?: string;
  /**
   * Callback fired when the page is changed.
   * @param {number} page The active page number.
   */
  onChange?: (page: number) => void;
  /**
   * Number of items per page.
   * @default 5
   */
  pageSize?: number;
  /**
   * Total number of items.
   * @default 0
   */
  total?: number;
}

const PaginationJumper = forwardRef<HTMLDivElement, PaginationJumperProps>(
  (props, ref) => {
    const {
      buttonText,
      className,
      disabled,
      hintText,
      inputPlaceholder,
      onChange: handleChange,
      pageSize = 5,
      total = 0,
      ...rest
    } = props;

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const totalPages = total ? Math.ceil(total / pageSize) : 1;

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
      <div {...rest} ref={ref} className={cx(classes.host, className)}>
        <Typography component="div" ellipsis variant="label-primary">
          {hintText}
        </Typography>
        <Input
          size="sub"
          disabled={disabled}
          error={error}
          variant="number"
          className={classes.input}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={inputPlaceholder}
          inputProps={{
            onKeyDown: handleKeyDown,
          }}
          value={value}
        />
        <Button size="sub" disabled={disabled} onClick={handleClick}>
          {buttonText}
        </Button>
      </div>
    );
  },
);

export default PaginationJumper;
