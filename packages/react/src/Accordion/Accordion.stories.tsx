import { useState } from 'react';
import Accordion, { AccordionSummary, AccordionDetails } from '.';

export default {
  title: 'Data Display/Accordion',
};

export const Basic = () => (
  <div style={{ width: '100%', maxWidth: '680px' }}>
    <Accordion disabled>
      <AccordionSummary id="accordion-1">
        <span>Accordion1</span>
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Proin auctor, velit non fringilla mollis,
        lacus lacus tempor arcu, quis varius ligula velit a diam.
      </AccordionDetails>
    </Accordion>
    <Accordion defaultExpanded>
      <AccordionSummary id="accordion-2">
        Accordion2
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Proin auctor, velit non fringilla mollis,
        lacus lacus tempor arcu, quis varius ligula velit a diam.
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary id="accordion-3">
        Accordion3
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Proin auctor, velit non fringilla mollis,
        lacus lacus tempor arcu, quis varius ligula velit a diam.
      </AccordionDetails>
    </Accordion>
  </div>
);

export const Controlled = () => {
  const [activeAccordion, setActiveAccordion] = useState<number>(-1);

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>
      <Accordion expanded={activeAccordion === 0} onChange={(open) => setActiveAccordion(open ? 0 : -1)}>
        <AccordionSummary id="accordion-1">
          <span>Accordion1</span>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin auctor, velit non fringilla mollis,
          lacus lacus tempor arcu, quis varius ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={activeAccordion === 1} onChange={(open) => setActiveAccordion(open ? 1 : -1)}>
        <AccordionSummary id="accordion-2">
          Accordion2
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin auctor, velit non fringilla mollis,
          lacus lacus tempor arcu, quis varius ligula velit a diam.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={activeAccordion === 2} onChange={(open) => setActiveAccordion(open ? 2 : -1)}>
        <AccordionSummary id="accordion-3">
          Accordion3
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin auctor, velit non fringilla mollis,
          lacus lacus tempor arcu, quis varius ligula velit a diam.
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
