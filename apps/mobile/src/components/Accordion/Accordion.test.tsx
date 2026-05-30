import React from 'react';

import {Accordion, AccordionItem} from '@/components/Accordion/Accordion';
import {act, renderComponent, TestRendererTree} from '@/test/testRenderer';

function renderAccordion(
  expandedId: string | null,
  onExpandedChange: (id: string | null) => void,
): TestRendererTree {
  return renderComponent(
    <Accordion expandedId={expandedId} onExpandedChange={onExpandedChange}>
      <AccordionItem id="one" title="One" expanded={false} onToggle={() => {}}>
        <></>
      </AccordionItem>
      <AccordionItem id="two" title="Two" expanded={false} onToggle={() => {}}>
        <></>
      </AccordionItem>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('expands one section at a time', () => {
    let expandedId: string | null = null;
    const onExpandedChange = jest.fn((nextId: string | null) => {
      expandedId = nextId;
    });

    const tree = renderAccordion(expandedId, onExpandedChange);

    const headers = tree.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        node.props.accessibilityRole === 'button',
    );

    act(() => {
      headers[0].props.onPress();
    });

    expect(onExpandedChange).toHaveBeenCalledWith('one');

    expandedId = 'one';

    act(() => {
      tree.update(
        <Accordion expandedId={expandedId} onExpandedChange={onExpandedChange}>
          <AccordionItem id="one" title="One" expanded={false} onToggle={() => {}}>
            <></>
          </AccordionItem>
          <AccordionItem id="two" title="Two" expanded={false} onToggle={() => {}}>
            <></>
          </AccordionItem>
        </Accordion>,
      );
    });

    act(() => {
      headers[1].props.onPress();
    });

    expect(onExpandedChange).toHaveBeenLastCalledWith('two');
  });
});
