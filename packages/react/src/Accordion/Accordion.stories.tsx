import { useState, MouseEvent, RefObject } from 'react';
import { MoreVerticalIcon, PlusIcon } from '@mezzanine-ui/icons';
import Accordion, { AccordionSummary, AccordionDetails } from '.';
import Button from '../Button';
import Menu, { MenuItem, MenuSize, MenuDivider } from '../Menu';
import Dropdown from '../Dropdown';
import Icon from '../Icon';

export default {
  title: 'V1/Accordion',
};

export const Basic = () => (
  <div style={{ width: '100%', maxWidth: '680px' }}>
    <Accordion disabled>
      <AccordionSummary id="accordion-1">
        <span>Accordion1</span>
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
        velit non fringilla mollis, lacus lacus tempor arcu, quis varius ligula
        velit a diam.
      </AccordionDetails>
    </Accordion>
    <Accordion defaultExpanded>
      <AccordionSummary id="accordion-2">Accordion2</AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
        velit non fringilla mollis, lacus lacus tempor arcu, quis varius ligula
        velit a diam.
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary id="accordion-3">Accordion3</AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
        velit non fringilla mollis, lacus lacus tempor arcu, quis varius ligula
        velit a diam.
      </AccordionDetails>
    </Accordion>
  </div>
);

export const Controlled = () => {
  const [activeAccordion, setActiveAccordion] = useState<number>(-1);

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>
      <Accordion
        expanded={activeAccordion === 0}
        onChange={(open) => setActiveAccordion(open ? 0 : -1)}
      >
        <AccordionSummary id="accordion-1">
          <span>Accordion1</span>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={activeAccordion === 1}
        onChange={(open) => setActiveAccordion(open ? 1 : -1)}
      >
        <AccordionSummary id="accordion-2">Accordion2</AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={activeAccordion === 2}
        onChange={(open) => setActiveAccordion(open ? 2 : -1)}
      >
        <AccordionSummary id="accordion-3">Accordion3</AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export const WithSuffixActions = () => {
  const [open, toggleOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const onClose = () => {
    setAnchor(null);
    toggleOpen(false);
  };

  const demoMenu = (size?: MenuSize) => (
    <Menu size={size} style={{ border: 0, width: 100 }}>
      <MenuItem onClick={(e) => e.stopPropagation()}>查看</MenuItem>
      <MenuItem onClick={(e) => e.stopPropagation()}>編輯</MenuItem>
      <MenuDivider />
      <MenuItem onClick={(e) => e.stopPropagation()}>刪除</MenuItem>
    </Menu>
  );

  const suffixDropdown = (
    <Dropdown
      menu={demoMenu()}
      onClose={onClose}
      popperProps={{
        open,
        options: {
          placement: 'bottom-end',
        },
      }}
    >
      {(ref) => (
        <Icon
          ref={ref as RefObject<HTMLButtonElement | null>}
          icon={MoreVerticalIcon}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setAnchor(
              anchor === event.currentTarget ? null : event.currentTarget,
            );
            toggleOpen(true);
          }}
          style={{ fontSize: 24 }}
        />
      )}
    </Dropdown>
  );

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>
      <Accordion>
        <AccordionSummary
          id="accordion-1"
          suffixActions={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                  e.stopPropagation()
                }
              >
                編輯
              </Button>
              <Button
                danger
                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                  e.stopPropagation()
                }
              >
                刪除
              </Button>
            </div>
          }
        >
          <span>Accordion1</span>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary id="accordion-2">Accordion2</AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          prefixIcon={
            <Icon
              icon={PlusIcon}
              style={{ fontSize: 24, marginRight: '12px' }}
            />
          }
          id="accordion-3"
          suffixActions={suffixDropdown}
        >
          Accordion3
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor,
          velit non fringilla mollis, lacus lacus tempor arcu, quis varius
          ligula velit a diam.
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
