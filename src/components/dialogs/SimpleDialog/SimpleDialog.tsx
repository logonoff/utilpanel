import {
  CaptionButton,
  CaptionMenu,
  CommandBar,
  Dialog,
  Header,
  HeaderText,
  HeaderTitle,
} from '@shalecss/react';

export interface CommonDialogProps {
  id: string;
}

interface SimpleDialogProps extends CommonDialogProps {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({
  id,
  title,
  children,
  actions,
}) => (
  <Dialog id={id} style={{ minWidth: 'min(95vw, 400px)' }}>
    <Header compact={true}>
      <HeaderTitle>
        <HeaderText>{title}</HeaderText>
      </HeaderTitle>
      <CaptionMenu>
        <CaptionButton
          title="Close"
          type="button"
          commandfor={id}
          command="close"
        >
          ×
        </CaptionButton>
      </CaptionMenu>
    </Header>
    {children}
    {!!actions && (
      <CommandBar variant="space-between" gutter={true}>
        {actions}
      </CommandBar>
    )}
  </Dialog>
);
