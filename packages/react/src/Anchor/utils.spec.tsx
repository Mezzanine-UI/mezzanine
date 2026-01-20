import '@testing-library/jest-dom';
import React from 'react';
import Anchor from './Anchor';
import { extractTextContent, parseChildren } from './utils';
import type { AnchorItemData } from './AnchorItem';

describe('Anchor/utils', () => {
  describe('extractTextContent', () => {
    it('should return string as-is', () => {
      expect(extractTextContent('Hello', Anchor)).toBe('Hello');
    });

    it('should concat text from array nodes', () => {
      const node = ['Hello', ' ', 'World', 123 as unknown as React.ReactNode, null] as React.ReactNode;
      // non-string / non-element falls back to ''
      expect(extractTextContent(node, Anchor)).toBe('Hello World');
    });

    it('should extract text from normal React element children', () => {
      const node = <span>Hello <b>World</b></span>;
      expect(extractTextContent(node, Anchor)).toBe('Hello World');
    });

    it('should exclude Anchor component itself', () => {
      const node = (
        <div>
          Before
          <Anchor href="#x">Inside</Anchor>
          After
        </div>
      );
      expect(extractTextContent(node, Anchor)).toBe('BeforeAfter');
    });

    it('should exclude nested Anchor components deep inside tree', () => {
      const node = (
        <div>
          A
          <span>
            B
            <Anchor href="#x">
              C <span>D</span>
            </Anchor>
            E
          </span>
          F
        </div>
      );
      expect(extractTextContent(node, Anchor)).toBe('ABEF');
    });
  });

  describe('parseChildren', () => {
    it('should return empty array for plain strings', () => {
      expect(parseChildren('Just text', Anchor)).toEqual([]);
      expect(parseChildren(['a', 'b', 'c'], Anchor)).toEqual([]);
    });

    it('should warn and ignore invalid React element child types', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

      const result = parseChildren(
        [
          <div key="x">Invalid</div>,
          <Anchor key="a" href="#ok">OK</Anchor>,
        ],
        Anchor,
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(String(warnSpy.mock.calls[0]?.[0])).toContain('[Anchor] Invalid child type');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        href: '#ok',
        id: 'OK',
        name: 'OK',
      });

      warnSpy.mockRestore();
    });

    it('should ignore Anchor without href', () => {
      const result = parseChildren(<Anchor>NO</Anchor>, Anchor);
      expect(result).toEqual([]);
    });

    it('should use string children as id & name', () => {
      const result = parseChildren(<Anchor href="#a">Anchor A</Anchor>, Anchor);
      expect(result).toEqual([
        expect.objectContaining({
          href: '#a',
          id: 'Anchor A',
          name: 'Anchor A',
        }),
      ]);
    });

    it('should parse nested anchors into children array with id/name from extractTextContent', () => {
      const result = parseChildren(
        <Anchor href="#parent">
          <Anchor href="#child-1">Child 1</Anchor>
          <Anchor href="#child-2">Child 2</Anchor>
        </Anchor>,
        Anchor,
      );

      // Only parent is returned; nested anchors are in children
      expect(result).toHaveLength(1);

      // id/name is from extractTextContent (which excludes Anchor content, so empty)
      expect(result[0]).toMatchObject({
        href: '#parent',
        id: '',
        name: '',
      });

      // parent has children list
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children?.[0]).toMatchObject({ href: '#child-1', id: 'Child 1', name: 'Child 1' });
      expect(result[0].children?.[1]).toMatchObject({ href: '#child-2', id: 'Child 2', name: 'Child 2' });
    });

    it('should derive id & name from extracted text when nested element has no nested anchors', () => {
      const result = parseChildren(
        <Anchor href="#x">
          <span>
            Hello <b>World</b>
          </span>
        </Anchor>,
        Anchor,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        href: '#x',
        id: 'Hello World',
        name: 'Hello World',
      });
    });

    it('should push anchors prop items directly and return (no further parsing for that child)', () => {
      const anchors: AnchorItemData[] = [
        { href: '#a', id: 'a', name: 'A' },
        { href: '#b', id: 'b', name: 'B' },
      ];

      const result = parseChildren(
        [
          <Anchor key="x" href="#x">X</Anchor>,
          <Anchor key="y" anchors={anchors} />,
          <Anchor key="z" href="#z">Z</Anchor>,
        ],
        Anchor,
      );

      // X + anchors(2) + Z = 4
      expect(result).toHaveLength(4);
      expect(result.map((i) => i.href)).toEqual(['#x', '#a', '#b', '#z']);
    });

    it('should include optional props (disabled, autoScrollTo, title, onClick)', () => {
      const onClick = jest.fn();

      const result = parseChildren(
        <Anchor
          autoScrollTo
          disabled
          href="#a"
          onClick={onClick}
          title="T"
        >
          A
        </Anchor>,
        Anchor,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        href: '#a',
        id: 'A',
        name: 'A',
        disabled: true,
        autoScrollTo: true,
        title: 'T',
      });
      expect(typeof result[0].onClick).toBe('function');
    });

    it('should handle mixed children array correctly (ignore strings, parse anchors)', () => {
      const result = parseChildren(
        [
          'ignore me',
          <Anchor key="a" href="#a">A</Anchor>,
          'ignore me too',
          <Anchor key="b" href="#b">B</Anchor>,
        ],
        Anchor,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ href: '#a', id: 'A', name: 'A' });
      expect(result[1]).toMatchObject({ href: '#b', id: 'B', name: 'B' });
    });

    it('should handle nestedChildren as array with mixed text and anchors', () => {
      const result = parseChildren(
        <Anchor href="#parent">
          Some text
          <Anchor href="#child">Child</Anchor>
          More text
        </Anchor>,
        Anchor,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        children: [{ href: '#child', id: 'Child', name: 'Child' }],
        href: '#parent',
        id: 'Some textMore text',
        name: 'Some textMore text',
      });
    });

    it('should handle nestedChildren as array without any nested anchors', () => {
      const result = parseChildren(
        <Anchor href="#parent">
          Text A
          Text B
        </Anchor>,
        Anchor,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        children: undefined,
        href: '#parent',
        id: 'Text A Text B',
        name: 'Text A Text B',
      });
    });

    it('should warn with function name when component has no displayName', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

      function CustomComponent() {
        return <div>Custom</div>;
      }

      const result = parseChildren(
        <CustomComponent />,
        Anchor,
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(String(warnSpy.mock.calls[0]?.[0])).toContain('[Anchor] Invalid child type: <CustomComponent>');
      expect(result).toHaveLength(0);

      warnSpy.mockRestore();
    });

    it('should warn with Unknown when component has no displayName or name', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

      // Create a component with no name by using Object.defineProperty
      const AnonymousComponent = () => <div>Anonymous</div>;

      Object.defineProperty(AnonymousComponent, 'name', { value: '' });

      const result = parseChildren(
        <AnonymousComponent />,
        Anchor,
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(String(warnSpy.mock.calls[0]?.[0])).toContain('[Anchor] Invalid child type: <Unknown>');
      expect(result).toHaveLength(0);

      warnSpy.mockRestore();
    });
  });
});
