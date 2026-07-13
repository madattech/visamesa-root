import React, {useState} from 'react';

import {Accordion, AccordionItem} from '@/components/Accordion/Accordion';
import {act, renderComponent, TestRendererTree} from '@/test/testRenderer';

function findAccordionHeaders(tree: TestRendererTree) {
  return tree.root.findAll(
    node =>
      typeof node.props.onPress === 'function' &&
      node.props.accessibilityRole === 'button',
  );
}

function AccordionHarness({
  onExpandedChange,
}: {
  onExpandedChange: (id: string | null) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpandedChange = (nextId: string | null) => {
    onExpandedChange(nextId);
    setExpandedId(nextId);
  };

  return (
    <Accordion expandedId={expandedId} onExpandedChange={handleExpandedChange}>
      <AccordionItem id="one" title="One" expanded={false} onToggle={() => {}}>
        <></>
      </AccordionItem>
      <AccordionItem id="two" title="Two" expanded={false} onToggle={() => {}}>
        <></>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('expands one section at a time', () => {
    const onExpandedChange = jest.fn();

    const tree = renderComponent(
      <AccordionHarness onExpandedChange={onExpandedChange} />,
    );

    act(() => {
      findAccordionHeaders(tree)[0].props.onPress();
    });

    expect(onExpandedChange).toHaveBeenCalledWith('one');

    act(() => {
      findAccordionHeaders(tree)[1].props.onPress();
    });

    expect(onExpandedChange).toHaveBeenLastCalledWith('two');
  });
});
