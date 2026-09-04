import { flushPromises } from '@vue/test-utils';
import { messageClasses as classes } from '@mezzanine-ui/core/message';
import { message } from './message';

const messages = () =>
  Array.from(document.body.querySelectorAll(`.${classes.host}`));

const text = () => messages().map((node) => node.textContent?.trim());

describe('message', () => {
  beforeEach(() => {
    message.destroy();
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render into a root of its own', async () => {
    message.add({ children: 'hello' });
    await flushPromises();

    const root = document.body.querySelector(`.${classes.root}`);

    expect(root).not.toBeNull();
    expect(root?.querySelector(`.${classes.host}`)?.textContent?.trim()).toBe(
      'hello',
    );
  });

  describe('severities', () => {
    it.each(['success', 'warning', 'error', 'info'] as const)(
      'should render %s with its icon',
      async (severity) => {
        message[severity]('note');
        await flushPromises();

        const node = messages()[0];

        expect(node.classList.contains(classes.severity(severity))).toBe(true);
        expect(node.querySelector(`i.${classes.icon}`)).not.toBeNull();
      },
    );

    it('should render loading with a spinner instead of an icon', async () => {
      message.loading('working');
      await flushPromises();

      const node = messages()[0];

      expect(node.classList.contains(classes.severity('loading'))).toBe(true);
      expect(
        node.querySelector(`span.${classes.icon} .mzn-spin__spin`),
      ).not.toBeNull();
    });
  });

  describe('duration', () => {
    it('should close after the default three seconds', async () => {
      message.success('bye');
      await flushPromises();

      expect(messages()).toHaveLength(1);

      vi.advanceTimersByTime(3000);
      await flushPromises();
      // The exit transition has to finish before the node is removed.
      vi.advanceTimersByTime(1000);
      await flushPromises();

      expect(messages()).toHaveLength(0);
    });

    it('should keep a loading message open', async () => {
      message.loading('still working');
      await flushPromises();

      vi.advanceTimersByTime(10000);
      await flushPromises();

      expect(messages()).toHaveLength(1);
    });

    it('should pause the countdown while the pointer is over a message', async () => {
      message.success('hover me');
      await flushPromises();

      vi.advanceTimersByTime(2000);
      messages()[0].dispatchEvent(new MouseEvent('mouseenter'));

      // Well past the remaining second, but paused.
      vi.advanceTimersByTime(5000);
      await flushPromises();

      expect(messages()).toHaveLength(1);

      messages()[0].dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(1000);
      await flushPromises();
      vi.advanceTimersByTime(1000);
      await flushPromises();

      expect(messages()).toHaveLength(0);
    });
  });

  describe('keys', () => {
    it('should update a message in place when the key repeats', async () => {
      const key = message.loading('step 1');

      await flushPromises();
      message.success('done', { key });
      await flushPromises();

      expect(messages()).toHaveLength(1);
      expect(text()).toEqual(['done']);
      expect(
        messages()[0].classList.contains(classes.severity('success')),
      ).toBe(true);
    });

    it('should remove by key', async () => {
      const key = message.info('temporary');

      await flushPromises();
      message.remove(key);
      await flushPromises();

      expect(messages()).toHaveLength(0);
    });
  });

  it('should show at most four at once', async () => {
    ['a', 'b', 'c', 'd', 'e'].forEach((note) => message.loading(note));
    await flushPromises();

    expect(messages()).toHaveLength(4);
    expect(text()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should let config change the default duration', async () => {
    message.config({ duration: 500 });
    message.success('quick');
    await flushPromises();

    vi.advanceTimersByTime(500);
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(messages()).toHaveLength(0);

    message.config({ duration: 3000 });
  });
});
