import { StoryFn, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import Pagination, { PaginationProps } from './Pagination';

export default {
  title: 'Navigation/Pagination',
} as Meta;

export const Playground: StoryFn<PaginationProps> = ({
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

export const All: StoryFn = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        Basic
        <Pagination
          current={current}
          onChange={setCurrent}
          onChangePageSize={(p) => setPageSize(p)}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          renderPageSizeOptionName={(p) => `${p}`}
          total={100}
        />
      </div>
      <div>
        With Page Size Options
        <Pagination
          showPageSizeOptions
          current={current}
          onChange={setCurrent}
          onChangePageSize={(p) => setPageSize(p)}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          pageSizeLabel="每頁顯示："
          renderPageSizeOptionName={(p) => `${p}`}
          total={100}
        />
      </div>
      <div>
        With Jumper Options
        <Pagination
          current={current}
          onChange={setCurrent}
          onChangePageSize={(p) => setPageSize(p)}
          showJumper
          buttonText="確認"
          hintText="前往"
          renderPageSizeOptionName={(p) => `${p}`}
          total={100}
          inputPlaceholder="1"
        />
      </div>
      <div>
        Full Featured
        <Pagination
          showPageSizeOptions
          current={current}
          onChange={setCurrent}
          onChangePageSize={(p) => setPageSize(p)}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          pageSizeLabel="每頁顯示："
          showJumper
          buttonText="確認"
          hintText="前往"
          inputPlaceholder="1"
          renderResultSummary={(from, to, total) =>
            `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`
          }
          renderPageSizeOptionName={(p) => `${p}`}
          total={100}
        />
      </div>
    </div>
  );
};

Playground.args = {
  boundaryCount: 1,
  buttonText: '確認',
  disabled: undefined,
  hideNextButton: false,
  hidePreviousButton: false,
  hintText: '前往',
  inputPlaceholder: '1',
  pageSize: 5,
  showJumper: false,
  siblingCount: 1,
  total: 100,
};
