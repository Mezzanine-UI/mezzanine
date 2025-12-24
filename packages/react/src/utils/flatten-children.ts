import {
  Children,
  cloneElement,
  Fragment,
  FragmentProps,
  isValidElement,
  ReactNode,
} from 'react';

/**
 * Flattens nested React children into a single-level array. <br />
 * Preserves keys by concatenating parent keys with child keys. <br />
 * Handles fragments and nested fragments recursively. <br />
 *
 * @param children - The React children to flatten.
 * @param recursionDepth - The maximum depth to recurse into fragments. Default is -1 (infinite).
 * @param keys - The accumulated keys from parent elements.
 * @returns An array of flattened React nodes.
 */
export function flattenChildren(
  children: ReactNode,
  recursionDepth: number = -1,
  keys: (string | number)[] = [],
): ReactNode[] {
  if (recursionDepth === 0) {
    return Children.toArray(children);
  }

  return Children.toArray(children).reduce(
    (acc: ReactNode[], node, nodeIndex) => {
      if (isValidElement(node) && node.type === Fragment) {
        acc.push(
          ...flattenChildren(
            (node.props as FragmentProps).children,
            recursionDepth - 1,
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
