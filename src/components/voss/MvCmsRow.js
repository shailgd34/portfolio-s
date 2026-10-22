'use client';

const src = (v) =>
  v && typeof v === 'object'
    ? String(v.src || '')
    : typeof v === 'string'
    ? v
    : '';

/**
 * MARA VOSS — CMS bridge row.
 * Renders per CMS item inside hidden Collection Lists in the layout, so every page carries the live CMS and sections read these rows.
 */
export default function MvCmsRow(props = {}) {
  const {
    kind = '',
    slug = '',
    f1 = '',
    f2 = '',
    f3 = '',
    f4 = '',
    f5 = '',
    f6 = '',
    f7 = '',
    f8 = '',
    f9 = '',
    f10 = '',
    f11 = '',
    f12 = '',
    f13 = '',
    f14 = '',
    f15 = '',
    f16 = '',
    n1 = 0,
    n2 = 0,
    img,
    img2,
  } = props;

  return (
    <span
      data-mv-row={kind}
      data-slug={slug}
      data-f1={f1}
      data-f2={f2}
      data-f3={f3}
      data-f4={f4}
      data-f5={f5}
      data-f6={f6}
      data-f7={f7}
      data-f8={f8}
      data-f9={f9}
      data-f10={f10}
      data-f11={f11}
      data-f12={f12}
      data-f13={f13}
      data-f14={f14}
      data-f15={f15}
      data-f16={f16}
      data-n1={String(n1)}
      data-n2={String(n2)}
      data-img={src(img)}
      data-img2={src(img2)}
      aria-hidden
      style={{
        ...props.style,
        display: 'block',
        width: 1,
        height: 1,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
