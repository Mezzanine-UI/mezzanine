import {
  Children,
  cloneElement,
  Fragment,
  FragmentProps,
  isValidElement,
  ReactNode,
} from 'react';

export function flattenChildren(
  children: ReactNode,
  depth: number = 0,
  keys: (string | number)[] = [],
): ReactNode[] {
  return Children.toArray(children).reduce(
    (acc: ReactNode[], node, nodeIndex) => {
      if (isValidElement(node) && node.type === Fragment) {
        acc.push(
          ...flattenChildren(
            (node.props as FragmentProps).children,
            depth + 1,
            keys.concat(node.key || nodeIndex),
          ),
        );
      } else {
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              key: keys.concat(String(node.key)).join('.'),
            }),
          );
        } else if (
          typeof node === 'string' ||
          typeof node === 'number' ||
          typeof node === 'bigint'
        ) {
          acc.push(node);
        }
      }
      return acc;
    },
    [],
  );
}
