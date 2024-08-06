import { forwardRef, MouseEventHandler, useContext } from 'react';
import {
  toUploadResultCssVars,
  uploadResultClasses as classes,
  UploadResultSize,
  UploadResultStatus,
} from '@mezzanine-ui/core/upload';
import { DownloadIcon, TimesIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { MezzanineConfig } from '../Provider/context';

export interface UploadResultProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The name to display
   */
  name: string;
  /**
   * When 'x' icon is clicked, this callback will be fired.
   */
  onDelete?: MouseEventHandler;
  /**
   * When 'download' icon is clicked, this callback will be fired.
   */
  onDownload?: MouseEventHandler;
  /**
   * The progress percentage
   */
  percentage?: number;
  /**
   * The result sizing
   * @default 'medium'
   */
  size?: UploadResultSize;
  /**
   * Indicate current result status
   */
  status: UploadResultStatus;
}

/**
 * The react component for `mezzanine` upload result.
 */
const UploadResult = forwardRef<HTMLDivElement, UploadResultProps>(
  function UploadResult(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      className,
      name,
      onDelete,
      onDownload,
      percentage,
      size = globalSize,
      status,
      style: styleProp,
      ...rest
    } = props;
    const done = status === 'done';
    const error = status === 'error';
    const loading = status === 'loading';
    const cssVars = toUploadResultCssVars({ percentage });
    const style = {
      ...cssVars,
      ...styleProp,
    };

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          {
            [classes.error]: error,
            [classes.loading]: loading,
          },
          className,
        )}
        style={style}
      >
        <span className={classes.name}>{name}</span>
        <div className={classes.actions}>
          {loading && <Icon icon={SpinnerIcon} spin />}
          {done && (
            <Icon icon={DownloadIcon} onClick={onDownload} role="button" />
          )}
          {(done || error) && (
            <Icon icon={TimesIcon} onClick={onDelete} role="button" />
          )}
        </div>
      </div>
    );
  },
);

export default UploadResult;
