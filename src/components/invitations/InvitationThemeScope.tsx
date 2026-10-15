import type { CSSProperties, ReactNode } from 'react';
import type { TemplateDefinition } from '@/lib/templates/types';
import type { EventDesignEntity } from '@/lib/db/types';

type InvitationThemeScopeProps = {
  template: TemplateDefinition;
  design?: Partial<EventDesignEntity>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type InvitationThemeStyle = CSSProperties & {
  '--event-accent'?: string;
  '--event-paper'?: string;
  '--event-ink'?: string;
  '--event-primary'?: string;
  '--event-secondary'?: string;
  '--event-font-heading'?: string;
  '--event-font-body'?: string;
  '--event-font-scale'?: string;
  '--event-letter-spacing'?: string;
  '--event-line-height'?: string;
};

/**
 * Only wrap the public invitee page and its preview with this component.
 * Never wrap the creator app shell: event decoration should not leak into Kadi UI.
 */
export function InvitationThemeScope({
  template,
  design,
  children,
  className = '',
  style: customStyle,
}: InvitationThemeScopeProps) {
  const palette = design?.palette || template.palette;
  const typography = design?.typography;

  const style: InvitationThemeStyle = {
    '--event-accent': palette.accent || palette.primary,
    '--event-paper': palette.cardBackground,
    '--event-ink': palette.text || template.palette.text || '#272620',
    '--event-primary': palette.primary,
    '--event-secondary': palette.secondary,
    '--event-font-heading': typography?.headingFont || design?.fontFamily || (template.fonts.heading === 'sans' ? 'Inter, sans-serif' : 'Playfair Display, Georgia, serif'),
    '--event-font-body': typography?.bodyFont || 'Inter, sans-serif',
    '--event-font-scale': typography?.scale ? `${typography.scale}` : '1',
    '--event-letter-spacing': typography?.headingLetterSpacing !== undefined ? `${typography.headingLetterSpacing}em` : 'normal',
    '--event-line-height': typography?.bodyLineHeight !== undefined ? `${typography.bodyLineHeight}` : '1.6',
    ...customStyle,
  };

  return (
    <div className={`kadi-invitation-theme ${className}`.trim()} data-occasion={template.category} style={style}>
      {children}
    </div>
  );
}
