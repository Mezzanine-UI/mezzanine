import { useState, MouseEvent } from 'react';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import Accordion, { AccordionTitle, AccordionContent } from '.';
import Button from '../Button';
import Dropdown from '../Dropdown';
import AccordionActions from './AccordionActions';
import AutoComplete from '../AutoComplete';
import AccordionGroup from './AccordionGroup';
import Typography from '../Typography';

export default {
  title: 'Data Display/Accordion',
};

export const Basic = () => (
  <div
    style={{
      maxWidth: '680px',
      width: '100%',
      display: 'grid',
      gap: '32px',
    }}
  >
    <Typography variant="h3">Accordion Group - Size Main</Typography>
    <AccordionGroup size="main">
      <Accordion title="付款方式" disabled>
        目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
        您可以在結帳時選擇最方便的付款選項。
      </Accordion>
      <Accordion title="運送政策" defaultExpanded>
        訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
        享免運優惠，未滿則需支付 $80 運費。
      </Accordion>
      <Accordion title="退換貨須知">
        商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
        如有瑕疵或寄送錯誤，我們將負擔來回運費。
      </Accordion>
    </AccordionGroup>
    <Typography variant="h3">Accordion Group - Size Sub</Typography>
    <AccordionGroup size="sub">
      <Accordion title="付款方式" disabled>
        目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
        您可以在結帳時選擇最方便的付款選項。
      </Accordion>
      <Accordion title="運送政策" defaultExpanded>
        訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
        享免運優惠，未滿則需支付 $80 運費。
      </Accordion>
      <Accordion title="退換貨須知">
        商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
        如有瑕疵或寄送錯誤，我們將負擔來回運費。
      </Accordion>
    </AccordionGroup>
  </div>
);

export const Controlled = () => {
  const [activeAccordion, setActiveAccordion] = useState<number>(-1);

  return (
    <div
      style={{
        maxWidth: '680px',
        width: '100%',
      }}
    >
      <AccordionGroup>
        <Accordion
          expanded={activeAccordion === 0}
          onChange={(open) => setActiveAccordion(open ? 0 : -1)}
          title="篩選條件"
        >
          您可以在此更新您的姓名、電子郵件與聯絡電話。 變更將在儲存後立即生效。
        </Accordion>
        <Accordion
          expanded={activeAccordion === 1}
          onChange={(open) => setActiveAccordion(open ? 1 : -1)}
          title="安全性設定"
        >
          啟用雙重驗證以加強帳號安全，建議定期更換密碼，
          並避免使用與其他網站相同的密碼。
        </Accordion>
        <Accordion
          expanded={activeAccordion === 2}
          onChange={(open) => setActiveAccordion(open ? 2 : -1)}
          title="通知偏好"
        >
          選擇您希望接收的通知類型，包含訂單更新、促銷活動、
          系統公告等，可隨時調整設定。
        </Accordion>
      </AccordionGroup>
    </div>
  );
};

export const WithActions = () => {
  const [open, toggleOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const onClose = () => {
    setAnchor(null);
    toggleOpen(false);
  };

  const suffixDropdown = {
    children: (
      <Dropdown
        onClose={onClose}
        onSelect={() => toggleOpen(false)}
        onVisibilityChange={toggleOpen}
        open={open}
        options={[
          { id: 'view', name: '查看' },
          { id: 'edit', name: '編輯', showUnderline: true },
          { id: 'delete', name: '刪除', validate: 'danger' },
        ]}
        placement="bottom-end"
      >
        <Button
          icon={DotVerticalIcon}
          iconType="icon-only"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setAnchor(
              anchor === event.currentTarget ? null : event.currentTarget,
            );
          }}
          size="minor"
          variant="base-secondary"
        />
      </Dropdown>
    ),
  };

  return (
    <div
      style={{
        maxWidth: '680px',
        width: '100%',
      }}
    >
      <AccordionGroup>
        <Accordion>
          <AccordionTitle id="accordion-1">
            篩選條件
            <AccordionActions>
              <Button size="main" variant="base-text-link">
                編輯
              </Button>
              <Button
                color="danger"
                size="main"
                variant="destructive-text-link"
              >
                刪除
              </Button>
            </AccordionActions>
          </AccordionTitle>
          <AccordionContent
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <AutoComplete
              options={[
                { id: 'electronics', name: '電子產品' },
                { id: 'clothing', name: '服飾配件' },
                { id: 'food', name: '食品飲料' },
              ]}
              placeholder="選擇產品分類"
            />
            <AutoComplete
              options={[
                { id: 'on-sale', name: '上架中' },
                { id: 'off-shelf', name: '已下架' },
                { id: 'out-of-stock', name: '缺貨中' },
              ]}
              placeholder="選擇商品狀態"
            />
          </AccordionContent>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionTitle id="accordion-2">產品說明文件</AccordionTitle>
          <AccordionContent>
            包含產品規格書、使用手冊與保固條款，
            請於購買前詳閱相關文件以了解產品功能與限制。
          </AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTitle id="accordion-3" actions={suffixDropdown}>
            產品標籤
          </AccordionTitle>
          <AccordionContent>
            標籤可協助分類與搜尋產品，您可以為每個產品添加多個標籤，
            例如：熱銷、新品、限時優惠等。
          </AccordionContent>
        </Accordion>
      </AccordionGroup>
    </div>
  );
};
