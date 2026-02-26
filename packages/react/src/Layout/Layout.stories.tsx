import { Suspense, lazy, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PlusIcon } from '@mezzanine-ui/icons';
import FloatingButton from '../FloatingButton';
import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Foundation/Layout',
  component: Layout,
};

export default meta;

// ─── Partial Rendering helpers ────────────────────────────────────────────────

/**
 * Simulates an async RSC that fetches data on the server before rendering.
 *
 * In real Next.js usage, replace with an async Server Component:
 *
 *   async function DashboardStats() {
 *     const data = await fetch('/api/stats').then((r) => r.json());
 *     return <section>...</section>;
 *   }
 *
 * Then in the page:
 *
 *   <Suspense fallback={<StatsSkeleton />}>
 *     <DashboardStats />
 *   </Suspense>
 *
 * In this story, React.lazy + setTimeout simulates the 2-second async delay.
 * Reload the page to replay the loading animation.
 */
const DashboardStats = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: function DashboardStats() {
              return (
                <div
                  style={{
                    background: 'var(--mzn-color-layer-02)',
                    borderRadius: 'var(--mzn-radius-roomy)',
                    padding: 'var(--mzn-spacing-primitive-16)',
                  }}
                >
                  <h2>Dynamic Stats</h2>
                  <p>
                    This section was streamed from the server via PPR after a
                    2-second async operation.
                  </p>
                </div>
              );
            },
          }),
        2000,
      ),
    ),
);

/**
 * Skeleton shown while DashboardStats loads.
 * In Next.js PPR, this fallback is part of the static HTML shell sent to the
 * browser immediately; the real content replaces it once streaming completes.
 */
function StatsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading stats"
      style={{
        background: 'var(--mzn-color-background-neutral-subtle)',
        borderRadius: 'var(--mzn-radius-roomy)',
        height: 'var(--mzn-spacing-primitive-96)',
      }}
    />
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: StoryObj<typeof Layout> = {
  render: function Playground() {
    const [open, setOpen] = useState(false);

    return (
      <Layout>
        <Layout.Main>
          <div style={{ width: '100%', height: '200vh' }}>
            <h1>Main Content</h1>
            <p>
              This area uses the body scrollbar. Click the floating button to
              open the side panel, and drag the separator line to resize it.
            </p>
          </div>
          <FloatingButton
            autoHideWhenOpen
            icon={PlusIcon}
            iconType="icon-only"
            onClick={() => setOpen(true)}
            open={open}
          >
            Open Panel
          </FloatingButton>
        </Layout.Main>
        <Layout.SidePanel defaultSidePanelWidth={320} open={open}>
          <div style={{ padding: 'var(--mzn-spacing-primitive-24)' }}>
            <h2>Side Panel</h2>
            <p>This panel is position: fixed and scrolls independently.</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </Layout.SidePanel>
      </Layout>
    );
  },
};

/**
 * Demonstrates the recommended pattern for using Layout with Next.js Partial
 * Prerendering (PPR).
 *
 * ## How it works
 *
 * Because `Layout` is a Server Component (no 'use client'), its children are
 * processed as part of the RSC tree on the server. This means `<Suspense>`
 * boundaries placed inside `<Layout.Main>` are visible to Next.js and can be
 * used as PPR streaming holes.
 *
 * ## PPR behaviour (Next.js, `experimental.ppr: true`)
 *
 * 1. **Static shell** – The layout structure, static section, and
 *    `<StatsSkeleton />` fallback are rendered at build time and sent to the
 *    browser as immediately-available HTML.
 * 2. **Dynamic hole** – The server resolves `<DashboardStats />` (the async
 *    RSC) concurrently. Once ready, the HTML streams in and React swaps out
 *    the skeleton.
 * 3. **No layout shift** – `LayoutHost` is initialised with the correct
 *    `open`/`defaultSidePanelWidth` values read from `<Layout.SidePanel>`
 *    props at render time, so the CSS class and custom property are already
 *    correct in the static shell.
 *
 * ## Storybook simulation
 *
 * `DashboardStats` is a `React.lazy` component with a 2-second delay, which
 * mimics the async RSC boundary. Reload the page to replay the animation.
 */
export const WithPartialRendering: StoryObj<typeof Layout> = {
  name: 'With Partial Rendering (Suspense)',
  render: function WithPartialRendering() {
    const [open, setOpen] = useState(false);

    return (
      <Layout>
        <Layout.Main>
          {/* ── Static section ─────────────────────────────────────────────
           * Renders as part of the PPR static shell at build time.
           * No async operations; always immediately available.
           */}
          <section style={{ marginBottom: 'var(--mzn-spacing-primitive-24)' }}>
            <h1>Dashboard</h1>
            <p>
              This static section is part of the PPR shell. It renders
              immediately without waiting for any async data.
            </p>
          </section>

          {/* ── Dynamic section (PPR streaming hole) ──────────────────────
           * Wrap async content in <Suspense> to defer it from the static shell.
           *
           * Next.js PPR sends the fallback (<StatsSkeleton />) as part of the
           * initial HTML response, then streams the real content once the async
           * RSC resolves — all on the server, with no client-side waterfall.
           *
           * Replace <DashboardStats /> with your own async Server Component:
           *
           *   async function DashboardStats() {
           *     const data = await fetch('/api/stats').then(r => r.json());
           *     return <div>{data.value}</div>;
           *   }
           */}
          <Suspense fallback={<StatsSkeleton />}>
            <DashboardStats />
          </Suspense>

          <FloatingButton
            autoHideWhenOpen
            icon={PlusIcon}
            iconType="icon-only"
            onClick={() => setOpen(true)}
            open={open}
          >
            Open Panel
          </FloatingButton>
        </Layout.Main>

        <Layout.SidePanel defaultSidePanelWidth={320} open={open}>
          <div style={{ padding: 'var(--mzn-spacing-primitive-24)' }}>
            <h2>Side Panel</h2>
            <p>This panel is position: fixed and scrolls independently.</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </Layout.SidePanel>
      </Layout>
    );
  },
};
