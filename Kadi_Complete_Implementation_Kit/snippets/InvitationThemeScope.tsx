import type { CSSProperties, ReactNode } from 'react';
import type { TemplateDefinition } from '@/lib/templates/types';

type InvitationThemeScopeProps = {
  template: TemplateDefinition;
  children: ReactNode;
  className?: string;
};

type InvitationThemeStyle = CSSProperties & {
  '--event-accent'?: string;
  '--event-paper'?: string;
  '--event-ink'?: string;
};

/**
 * Only wrap the public invitee page and its preview with this component.
 * Never wrap the creator app shell: event decoration should not leak into Kadi UI.
 */
export function InvitationThemeScope({ template, children, className = '' }: InvitationThemeScopeProps) {
  const style: InvitationThemeStyle = {
    '--event-accent': template.palette.primary,
    '--event-paper': template.palette.cardBackground,
    '--event-ink': template.palette.text,
  };

  return (
    <div className={`kadi-invitation-theme ${className}`.trim()} data-occasion={template.category} style={style}>
      {children}
    </div>
  );
}
