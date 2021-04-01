import { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import Pagination, { PaginationProps } from './Pagination';

export default {
  title: 'Navigation/Pagination',
} as Meta;

export const Playground: Story<PaginationProps> = ({
  boundaryCount,
  buttonText,
  disabled,
  hideNextButton,
  hidePreviousButton,
  hintText,
  inputPlaceholder,
  pageSize,
  showJumper,
  siblingCount,
  total,
}) => {
  const [current, setCurrent] = useState(1);

  return (
    <Pagination
      boundaryCount={boundaryCount}
      buttonText={buttonText}
      current={current}
      disabled={disabled}
      hideNextButton={hideNextButton}
      hidePreviousButton={hidePreviousButton}
      hintText={hintText}
      inputPlaceholder={inputPlaceholder}
      pageSize={pageSize}
      onChange={setCurrent}
      showJumper={showJumper}
      siblingCount={siblingCount}
      total={total}
    />
  );
};

export const WithJumper: Story = () => {
  const [current, setCurrent] = useState(1);

  return (
    <Pagination
      buttonText="確認"
      current={current}
      hintText="前往"
      inputPlaceholder="頁碼"
      showJumper
      onChange={setCurrent}
      total={100}
    />
  );
};

Playground.args = {
  boundaryCount: 1,
  buttonText: '確認',
  disabled: false,
  hideNextButton: false,
  hidePreviousButton: false,
  hintText: '前往',
  inputPlaceholder: '頁碼',
  pageSize: 5,
  showJumper: false,
  siblingCount: 1,
  total: 100,
};
